import { useState } from "react";
import { useRoute } from "wouter";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { Square } from "@/assets/square";

import { killStream, useStreamManager } from "@/hooks/useStreamManager";

function CloseStream() {
  const [, params] = useRoute<{ roomId: string }>("/:roomId");
  const [disabled, setDisabled] = useState(false);

  async function onStopStream() {
    setDisabled(true);
    if (!params?.roomId) return;
    killStream();
    setDisabled(false);
  }

  const { isLive, isStreaming } = useStreamManager();

  if (!isLive || !isStreaming) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button disabled={disabled} onClick={onStopStream} variant="ghost">
          <Square className="text-red-500" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Stop Streaming</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default CloseStream;
