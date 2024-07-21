import { Suspense, lazy } from "react";

const Player = lazy(() => import("@/components/room/player"));
import Loading from "@/components/ui/loading";
import WaitingForPeer from "@/components/room/waiting-for-peer";
import WaitingForStream from "@/components/room/waiting-for-stream";

import { useManager } from "@/hooks/useManager";
import usePeerConnection from "@/hooks/usePeerConnection";
import { useStreamManager } from "@/hooks/useStreamManager";

export default function Room() {
  usePeerConnection();
  const { isConnected } = useManager();
  const { isLive, onFileSelected } = useStreamManager();

  return (
    <main className="w-[calc(100vw-32px)] flex-grow mx-auto grid place-items-center">
      {!isConnected && <WaitingForPeer />}
      {isConnected && !isLive && (
        <WaitingForStream onFileDrop={onFileSelected} />
      )}
      <Suspense fallback={<Loading />}>
        <Player />
      </Suspense>
    </main>
  );
}
