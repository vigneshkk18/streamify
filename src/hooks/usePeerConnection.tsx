import { io } from "socket.io-client";
import ShortUniqueId from "short-unique-id";
import { useCallback, useEffect } from "react";
import { useLocation, useParams } from "wouter";

import { toast } from "@/components/ui/use-toast";

import {
  createAnswer,
  createDataChannel,
  createOffer,
  useManager,
} from "@/hooks/useManager";
import useSearchParams from "@/hooks/useSearchParams";

import { isCreatee as isCreateeRule, isJoinee as isJoineeRule } from "@/rules";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
});

const generator = new ShortUniqueId({ length: 10 });
function getUID() {
  return generator.rnd();
}

function onPeerLeft(uuid: string) {
  if (uuid === useManager.getState().uid) return;
  const dataChannel = useManager.getState().dataChannel;
  if (dataChannel) {
    dataChannel.close();
  }
  useManager.setState({
    isReady: false,
    isConnected: false,
    dataChannel: null,
  });
}

async function onNegotiationNeeded(
  connection: RTCPeerConnection,
  roomId: string,
  uid: string
) {
  const offer = await createOffer(connection);
  socket.emit("onOffer", { roomId: roomId, offer, uuid: uid });
}

export default function usePeerConnection() {
  const params = useParams<{ roomId: string }>();
  const searchParams = useSearchParams<{ peerType: "createe" | "joinee" }>();
  const { connection, uid, isReady } = useManager();
  const [, navigate] = useLocation();

  const exitRoom = useCallback(
    (uuid: string) => {
      if (uuid === useManager.getState().uid) return;
      const connection = useManager.getState().connection;
      if (!connection) {
        navigate("/");
        return;
      }
      connection.close();
      useManager.setState({
        connection: null,
        isReady: false,
        isConnected: false,
        dataChannel: null,
      });
      navigate("/");
      toast({
        title: "Device has left the room",
        variant: "destructive",
      });
    },
    [navigate]
  );

  const processOffer = useCallback(
    async (offer: RTCSessionDescription, uuid: string) => {
      const { connection, uid } = useManager.getState();
      if (!connection || !params.roomId || uid === uuid) return;
      const answer = await createAnswer(connection, offer);
      socket.emit("onAnswer", { roomId: params.roomId, answer, uuid: uid });
    },
    [params.roomId]
  );

  const processAnswer = useCallback(
    async (answer: RTCSessionDescription, uuid: string) => {
      const { connection, uid } = useManager.getState();
      if (!connection || !params.roomId || uid === uuid) return;
      await connection.setRemoteDescription(answer);
    },
    [params.roomId]
  );

  const processIce = useCallback((ice: RTCIceCandidate, uuid: string) => {
    const { connection, uid } = useManager.getState();
    if (!connection || uid === uuid) return;
    connection.addIceCandidate(new RTCIceCandidate(ice));
  }, []);

  useEffect(() => {
    // wait for search params to be processed from search string.
    if (!searchParams) return;

    const roomId = params.roomId;
    const peerType = searchParams?.peerType;
    const isCreatee = isCreateeRule(peerType);
    const isJoinee = isJoineeRule(peerType);
    if (!roomId || !peerType || (!isCreatee && !isJoinee)) return;

    socket.connect();

    const uuid = getUID();

    function onIceCreated(ev: RTCPeerConnectionIceEvent) {
      if (ev.candidate) {
        socket.emit("onIce", { roomId, ice: ev.candidate, uuid });
      }
    }

    const connection = new RTCPeerConnection();
    connection.addEventListener("icecandidate", onIceCreated);

    if (isJoinee) {
      connection.ondatachannel = (ev) => {
        ev.channel.onopen = () => {
          useManager.setState({ isConnected: true });
        };
        ev.channel.onclose = () => {
          useManager.setState({ isConnected: false });
        };
        useManager.setState({ dataChannel: ev.channel });
      };
    }

    socket.emit(isCreatee ? "createRoom" : "joinRoom", { roomId });

    socket.on("roomAlreadyExists", exitRoom);
    socket.on("hostLeft", exitRoom);
    socket.on("peerLeft", onPeerLeft);

    function onPeersJoined() {
      const dataChannel = isCreatee ? createDataChannel(connection) : null;
      if (dataChannel) {
        dataChannel.onopen = () => {
          useManager.setState({ isConnected: true });
        };
        dataChannel.onclose = () => {
          useManager.setState({ isConnected: false });
        };
      }
      useManager.setState({ dataChannel, isReady: true });
    }

    socket.on("peersJoined", onPeersJoined);

    socket.on("onOffer", processOffer);
    socket.on("onAnswer", processAnswer);
    socket.on("onIce", processIce);

    useManager.setState({ connection, isReady: true, uid: uuid });

    function beforeUnload() {
      useManager.getState().connection?.close();
      useManager.setState({
        isReady: false,
        isConnected: false,
        dataChannel: null,
        connection: null,
      });
      socket.emit(isCreatee ? "closeRoom" : "leaveRoom", { roomId, uuid });
      socket.disconnect();
    }

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      socket.off("roomAlreadyExists", exitRoom);
      socket.off("hostLeft", exitRoom);
      socket.off("peersLeft", onPeerLeft);
      socket.off("peersJoined", onPeersJoined);
      socket.off("onOffer", processOffer);
      socket.off("onAnswer", processAnswer);
      socket.on("offIce", processIce);
      connection.removeEventListener("icecandidate", onIceCreated);
      window.removeEventListener("beforeunload", beforeUnload);
      beforeUnload();
    };
  }, [
    exitRoom,
    params.roomId,
    processAnswer,
    processIce,
    processOffer,
    searchParams,
    navigate,
  ]);

  useEffect(() => {
    const peerType = searchParams?.peerType;
    const isJoinee = isJoineeRule(peerType);
    const isCreatee = isCreateeRule(peerType);
    if (
      !connection ||
      !params.roomId ||
      !uid ||
      !isReady ||
      (!isJoinee && !isCreatee)
    )
      return;

    function oniceconnectionstatechange() {
      const iceConnectionState = connection?.iceConnectionState;
      if (
        !isCreatee ||
        !iceConnectionState ||
        !["closed", "disconnected", "failed"].includes(
          connection?.iceConnectionState
        )
      )
        return;
      negotiationneeded();
    }

    const negotiationneeded = () =>
      onNegotiationNeeded(connection, params.roomId, uid);
    connection.addEventListener("negotiationneeded", negotiationneeded);
    connection.addEventListener(
      "iceconnectionstatechange",
      oniceconnectionstatechange
    );
    return () => {
      connection.removeEventListener("negotiationneeded", negotiationneeded);
      connection.removeEventListener(
        "iceconnectionstatechange",
        oniceconnectionstatechange
      );
    };
  }, [connection, params.roomId, uid, isReady, searchParams]);
}
