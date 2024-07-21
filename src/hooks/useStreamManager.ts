import { create } from "zustand";
import { PlayerSrc } from "@vidstack/react";
import { ChangeEvent, useCallback, useEffect } from "react";

import { useManager } from "@/hooks/useManager";

type Store = {
  isLive: boolean;
  isStreaming: boolean;
  src: PlayerSrc | null;
};

const store: Store = {
  isLive: false,
  isStreaming: false,
  src: null,
};

export const streamManagerHook = create(() => store);

function onTrack(ev: RTCTrackEvent) {
  const stream = ev.streams?.[0]?.clone();
  if (!stream || streamManagerHook.getState().isStreaming) return;
  streamManagerHook.setState({
    isLive: true,
    isStreaming: false,
    src: { src: stream, type: "video/object" },
  });
}

export function killStream() {
  const dataChannel = useManager.getState().dataChannel;
  if (!dataChannel) return;
  dataChannel.send(JSON.stringify({ type: "streaming-stopped" }));
  streamManagerHook.setState({
    isLive: false,
    isStreaming: false,
    src: null,
  });
}

export function useStreamManager() {
  const { connection, dataChannel, isConnected } = useManager();
  const state = streamManagerHook();

  useEffect(() => {
    if (!dataChannel) return;
    function onStreamClose(ev: MessageEvent) {
      const data = JSON.parse(ev.data);
      if (data.type === "streaming-stopped") {
        streamManagerHook.setState({ isLive: false, isStreaming: false });
      }
    }
    dataChannel.addEventListener("message", onStreamClose);
    return () => {
      dataChannel.removeEventListener("message", onStreamClose);
    };
  }, [dataChannel]);

  useEffect(() => {
    if (!isConnected || !connection) return;
    connection.addEventListener("track", onTrack);

    return () => {
      connection.removeEventListener("track", onTrack);
    };
  }, [isConnected, connection]);

  const onFileSelected = useCallback(
    (
      event: ChangeEvent<HTMLInputElement> & {
        target: HTMLInputElement & { captureStream: () => MediaStream };
      }
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);

      streamManagerHook.setState({
        src: { src: url, type: "video/mp4" },
        isLive: true,
        isStreaming: true,
      });
    },
    []
  );

  return { ...state, onFileSelected };
}
