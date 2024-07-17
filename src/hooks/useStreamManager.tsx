import { ChangeEvent, useEffect, useSyncExternalStore } from "react";
import { useManager } from "./useManager";
import { dataChannel } from "@/stream/data-channel";

let isReady = false;
let listeners: any[] = [];

const store = {
  subscribe: (listener: any) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((li) => li !== listener);
    };
  },
  getSnapshot: () => {
    return isReady;
  },
};

function setReady(target: boolean) {
  isReady = target;
  emitChange();
}

function emitChange() {
  listeners.forEach((li) => {
    li();
  });
}

export function useStreamManager(
  roomId: string,
  peerType: "createe" | "joinee",
  videoEl: HTMLVideoElement | null
) {
  const isReady = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const { isReady: isManagerReady, manager } = useManager(roomId, peerType);

  useEffect(() => {
    if (!isManagerReady || !manager) return;
    dataChannel?.on("message", (event: any) => {
      const obj = JSON.parse(event.data);
      console.log(obj);
      if (obj.type === "peer-started-streaming") {
        manager.removeTracks();
      }
    });

    // manager.onChange("STREAMS", console.log);
    manager.connection.ontrack = (ev) => {
      console.log(ev);
    };
  }, [isManagerReady, manager]);

  function onFileSelected(
    this: HTMLInputElement,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file || !videoEl) return;
    const url = URL.createObjectURL(file);
    dataChannel?.sendMessage(
      JSON.stringify({ type: "peer-started-streaming" })
    );

    videoEl.src = url;
    videoEl.controls = true;

    videoEl.addEventListener(
      "loadstart",
      function (this: HTMLVideoElement & { captureStream: () => MediaStream }) {
        const stream = this.captureStream();
        console.log(stream);
        stream.getTracks().forEach((track) => {
          manager?.addTrack(track, stream);
        });
      }
    );
    setReady(true);
  }

  return { isReady, onFileSelected };
}
