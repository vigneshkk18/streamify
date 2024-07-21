import { useParams } from "wouter";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WaitingForPeer() {
  const { roomId } = useParams<{ roomId: string }>();
  const url = `${window.location.origin}/${roomId}?peerType=joinee`;

  function copyToClipboard() {
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="p-8 rounded-lg">
      <h3 className="text-2xl font-bold">
        Waiting for the other device to join the room.
      </h3>
      <div className="mt-4 text-center">
        <span className="text-center mt-12">Please open this</span>
        <Tooltip>
          <TooltipTrigger
            onClick={copyToClipboard}
            className="bg-primary text-white rounded font-mono p-1 mx-2 cursor-pointer"
          >
            link
          </TooltipTrigger>
          <TooltipContent>
            <p>{url}</p>
          </TooltipContent>
        </Tooltip>
        <span>in the other device</span>
      </div>
    </div>
  );
}
