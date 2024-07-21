import { useState } from "react";
import { useLocation, useRoute } from "wouter";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChatButton from "@/components/room/chat";
import { Button } from "@/components/ui/button";
import CloseStream from "@/components/room/close-stream";

import { exitRoom, useManager } from "@/hooks/useManager";

import { Leave } from "@/assets/leave";

function RoomControls() {
  const [disabled, setDisabled] = useState(false);

  const [, navigate] = useLocation();
  const [isRoomPage, params] = useRoute<{ roomId: string }>("/:roomId");
  const { isConnected } = useManager();

  async function onLeaveRoom() {
    setDisabled(true);
    const peerType = new URLSearchParams(window.location.search)?.get(
      "peerType"
    );
    if (
      !peerType ||
      !params?.roomId ||
      (peerType !== "createe" && peerType !== "joinee")
    )
      return;
    exitRoom(params.roomId, peerType);
    setDisabled(false);
    navigate("/");
  }

  if (!isRoomPage || !isConnected) {
    return null;
  }

  return (
    <footer className="hidden sm:flex w-max bg-background rounded-xl mx-auto my-4 p-4 gap-4 items-center justify-center shadow-primary shadow">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={disabled}
            onClick={onLeaveRoom}
            variant="destructive"
          >
            <Leave className="text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Leave Room</p>
        </TooltipContent>
      </Tooltip>
      <CloseStream />
      <ChatButton />
    </footer>
  );
}

export default RoomControls;
