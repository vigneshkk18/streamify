import { Redirect, useParams } from "wouter";
import { useManager } from "@/hooks/useManager";
import WaitingForPeer from "@/components/room/waiting-for-peer";
import WaitingForStream from "@/components/room/waiting-for-stream";
import { useRef } from "react";
import { useStreamManager } from "@/hooks/useStreamManager";

export default function Room() {
  const { roomId, peerType } = useParams<{
    roomId: string;
    peerType: "createe" | "joinee";
  }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isReady: isStreamReady, onFileSelected } = useStreamManager(
    roomId,
    peerType,
    videoRef.current
  );
  const { isReady } = useManager(roomId, peerType);

  if (peerType !== "createe" && peerType !== "joinee") {
    return <Redirect to="/" />;
  }

  return (
    <main className="w-[calc(100vw-32px)] flex-grow mx-auto grid place-items-center">
      {!isReady && <WaitingForPeer />}
      {/* {isReady && <WaitingForStream />} */}
      {!isStreamReady && isReady && (
        <WaitingForStream onFileDrop={onFileSelected} />
      )}
      <video ref={videoRef} className="w-full max-w-[100vh]" />
    </main>
  );
}
