import { useRef, useState } from "react";
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
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useManager } from "@/hooks/useManager";
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

function Player() {
  const [showDialog, setShowDialog] = useState(false);
  const ref = useRef<MediaPlayerInstance>(null);
  const { connection } = useManager();
  const { isLive, isStreaming, src } = useStreamManager();

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

  if (!isLive || !src) return;

  return (
    <>
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
    </>
  );
}

export default Player;
