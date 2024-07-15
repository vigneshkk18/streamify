import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Send } from "@/assets/send";
import { Chat as ChatIcon } from "@/assets/chat";

function Chat() {
  return (
    <SheetContent className="flex flex-col bg-background">
      <SheetHeader>
        <SheetTitle>Room Messages</SheetTitle>
      </SheetHeader>
      <ul className="flex-grow">
        <li className="max-w-[75%] bg-muted/20 border px-2 py-1 rounded-md w-max">
          Hello
        </li>
        <li className="bg-primary text-white max-w-[75%] border px-2 py-1 rounded-md w-max ml-auto">
          Hi
        </li>
        <li className="max-w-[75%] bg-muted/20 border px-2 py-1 rounded-md w-max">
          How are you?
        </li>
        <li className="bg-primary text-white max-w-[75%] border px-2 py-1 rounded-md w-max ml-auto">
          I am good.
        </li>
      </ul>
      <div className="flex w-full items-center space-x-2">
        <Input type="text" placeholder="Type your message..." />
        <Button variant="ghost" size="lg" className="px-2">
          <Send className="text-black dark:text-white" />
        </Button>
      </div>
    </SheetContent>
  );
}

export default function ChatButton() {
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" className="w-full sm:w-auto">
              <ChatIcon className="text-black dark:text-white" />
              <span className="ml-2 sm:hidden">Open Messages</span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open Messages</p>
        </TooltipContent>
      </Tooltip>
      <Chat />
    </Sheet>
  );
}
