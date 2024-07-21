import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
} from "@vidstack/react";
import {
  PlyrControl,
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { useRef, useState } from "react";
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WaitingForPeer from "@/components/room/waiting-for-peer";
import WaitingForStream from "@/components/room/waiting-for-stream";

import { useManager } from "@/hooks/useManager";
import usePeerConnection from "@/hooks/usePeerConnection";
import { useStreamManager } from "@/hooks/useStreamManager";

const StreamingVideoControls: PlyrControl[] = [
  "play",
  "progress",
  "pip",
  "fullscreen",
  "current-time",
  "captions",
];

const RecievingVideoControls: PlyrControl[] = ["pip", "fullscreen", "captions"];

export default function Room() {
  usePeerConnection();
  const [showDialog, setShowDialog] = useState(false);
  const { isConnected, connection } = useManager();
  const { isLive, isStreaming, onFileSelected, src } = useStreamManager();
  const ref = useRef<MediaPlayerInstance>(null);

  const onLoadedMetadata = () => {
    const videoEl = document.querySelector(
      "div[data-media-player] video"
    ) as HTMLVideoElement & { captureStream: () => MediaStream };
    if (!videoEl || !isStreaming) return;
    const newStream = videoEl.captureStream().clone();

    newStream.getTracks().forEach((track) => {
      connection?.addTrack(track, newStream);
    });
  };

  const replayVideo = () => {
    if (ref.current) {
      ref.current.play();
      setShowDialog(false);
    }
  };

  const onVideoError = () => {
    setShowDialog(true);
  };

  return (
    <main className="w-[calc(100vw-32px)] flex-grow mx-auto grid place-items-center">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unable To auto play video</DialogTitle>
            <DialogDescription>
              Please click the play button to play video
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={replayVideo}>Play</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!isConnected && <WaitingForPeer />}
      {isConnected && !isLive && (
        <WaitingForStream onFileDrop={onFileSelected} />
      )}
      {isLive && src && (
        <MediaPlayer
          className="player shadow-primary shadow-md"
          onLoadedMetadata={onLoadedMetadata}
          autoPlay
          playsInline
          ref={ref}
          onPlayFail={onVideoError}
          src={src}
        >
          <MediaProvider />
          <PlyrLayout
            controls={
              isStreaming ? StreamingVideoControls : RecievingVideoControls
            }
            icons={plyrLayoutIcons}
          />
        </MediaPlayer>
      )}
    </main>
  );
}
