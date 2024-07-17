import { io } from "socket.io-client";
import { useEffect, useSyncExternalStore } from "react";

import { OfferPeerManager } from "@/stream/offer-peer-manager";
import { AnswerPeerManager } from "@/stream/answer-peer-manager";

type State = {
  type: "OFFER_MANAGER" | "ANSWER_MANAGER" | "NOT_INITIALIZED";
  manager: OfferPeerManager | AnswerPeerManager | null;
  description: RTCSessionDescription | null;
  isReady: boolean;
  isConnectedToPeer: boolean;
  isReadyToConnect: boolean;
};

let state: State = {
  type: "NOT_INITIALIZED",
  manager: null,
  description: null,
  isReady: false,
  isConnectedToPeer: false,
  isReadyToConnect: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let listeners: any[] = [];

export const todosStore = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(listener: any) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return state;
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export async function initialize(type: "createe" | "joinee") {
  const managerType = type === "createe" ? "OFFER_MANAGER" : "ANSWER_MANAGER";
  state = { ...state, type: managerType };
  if (managerType === "OFFER_MANAGER") {
    state.manager = new OfferPeerManager();
  } else {
    state.manager = new AnswerPeerManager();
  }
  state.manager.onChange = (type) => {
    console.log(type);
    if (type === "CONNECTED") onConnected();
    if (type === "LOCAL_DESCRIPTION_SET") onLocalDescriptionSet();
    if (type === "REMOTE_DESCRIPTION_SET") onRemoteDescription();
  };
  if (managerType === "OFFER_MANAGER" && !state.description)
    await state.manager.createDescription();
  emitChange();
}

function onConnected() {
  state = { ...state, isReady: true };
  emitChange();
}

async function onLocalDescriptionSet() {
  const manager = state.manager;
  if (!manager) return;
  state = { ...state, isReadyToConnect: true };
  state.description = await manager.getDescription();
  emitChange();
}

function onRemoteDescription() {
  state = { ...state, isConnectedToPeer: true };
  emitChange();
}

export async function setRemoteDescription(description: RTCSessionDescription) {
  const manager = state.manager;
  if (!manager) return;
  await manager.setRemoteDescription(description);
  if (state.type === "ANSWER_MANAGER" && !state.description)
    manager.createDescription();
}

const socket = io("http://localhost:3000");

export function useManager(roomId: string, peerType: "createe" | "joinee") {
  const manager = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot
  );

  useEffect(() => {
    // create / join room.
    if ((peerType !== "createe" && peerType !== "joinee") || !roomId) return;

    const timer = setTimeout(() => {
      initialize(peerType);
      socket.emit(peerType === "createe" ? "createRoom" : "joinRoom", {
        roomId,
      });
      socket.on("remoteDescription", (data) => {
        console.log(
          peerType === "createe" ? "answer received" : "offer received"
        );
        // once offer / answer is received, set it to Connection.
        setRemoteDescription(data);
      });
    }, 0);
    return () => {
      socket.emit("leaveRoom", { roomId, peerType });
      clearTimeout(timer);
    };
  }, [roomId, peerType]);

  useEffect(() => {
    // create offer -> send it to joinee through socket.
    if (!manager.description || peerType !== "createe") return;
    const timer = setTimeout(() => {
      socket.emit("createOffer", { roomId, description: manager.description });
    }, 0);
    return () => clearTimeout(timer);
  }, [manager.description, roomId, peerType]);

  useEffect(() => {
    console.log(manager.description, peerType, roomId);
    // create answer -> send it to createe through socket.
    if (!manager.description || peerType !== "joinee") return;
    const timer = setTimeout(() => {
      socket.emit("createAnswer", { roomId, description: manager.description });
    }, 0);
    return () => clearTimeout(timer);
  }, [manager.description, peerType, roomId]);

  return manager;
}
