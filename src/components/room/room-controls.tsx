import ChatButton from "@/components/room/chat";
import { Button } from "@/components/ui/button";
import { Leave } from "@/assets/leave";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function RoomControls() {
  return (
    <footer className="hidden sm:flex w-max bg-background rounded-xl mx-auto my-4 p-4 gap-4 items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive">
            <Leave className="text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Leave Room</p>
        </TooltipContent>
      </Tooltip>
      <ChatButton />
    </footer>
  );
}

export default RoomControls;
