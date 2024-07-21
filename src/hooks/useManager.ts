import { create } from "zustand";

import { isCreatee } from "@/rules";
import { socket } from "@/hooks/usePeerConnection";

type Store = {
  uid: string;
  connection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  description: RTCSessionDescription | null;
  isReady: boolean;
  isConnected: boolean;
};

const store: Store = {
  uid: "",
  connection: null,
  dataChannel: null,
  description: null,
  isReady: false,
  isConnected: false,
};

export const useManager = create(() => store);

export async function createOffer(connection: RTCPeerConnection) {
  const offer = await connection.createOffer();
  await connection.setLocalDescription(offer);
  return offer;
}

export async function createAnswer(
  connection: RTCPeerConnection,
  offer: RTCSessionDescription
) {
  await connection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await connection.createAnswer();
  await connection.setLocalDescription(answer);
  return answer;
}

export function createDataChannel(connection: RTCPeerConnection) {
  return connection.createDataChannel("data-channel");
}

export function exitRoom(roomId: string, peerType: "createe" | "joinee") {
  const connection = useManager.getState().connection;
  if (!connection) return;
  connection.close();
  useManager.setState({
    isReady: false,
    isConnected: false,
    dataChannel: null,
  });
  socket.emit(isCreatee(peerType) ? "closeRoom" : "leaveRoom", { roomId });
}
