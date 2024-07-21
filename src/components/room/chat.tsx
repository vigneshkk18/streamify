import { MouseEvent, useRef } from "react";

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

import { closeMenu } from "@/hooks/useMenu";
import { useManager } from "@/hooks/useManager";
import { Message as IMessage, setChatState, useChat } from "@/hooks/useChat";

import { Send } from "@/assets/send";
import { Chat as ChatIcon } from "@/assets/chat";

function Message({ self, message }: IMessage) {
  const style = self ? "bg-primary text-white ml-auto" : "bg-muted/20";
  return (
    <li className={`max-w-[75%] ${style} border px-2 py-1 rounded-md w-max`}>
      {message}
    </li>
  );
}

function Chat() {
  const { messages } = useChat();
  const input = useRef<HTMLInputElement>(null);
  const { dataChannel } = useManager();

  function sendMessage(event: MouseEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dataChannel || !input.current) return;
    const newMessage: IMessage & { type: "message" } = {
      type: "message",
      message: input.current.value,
      self: true,
      time: new Date().toISOString(),
    };
    dataChannel.send(JSON.stringify(newMessage));
    useChat.setState({
      messages: [...useChat.getState().messages, newMessage],
    });
    input.current.value = "";
  }

  return (
    <SheetContent className="flex flex-col bg-background">
      <SheetHeader>
        <SheetTitle>Room Messages</SheetTitle>
      </SheetHeader>
      <ul className="flex-grow flex flex-col gap-2">
        {messages.map((msg) => (
          <Message key={msg.time} {...msg} />
        ))}
      </ul>
      <div className="flex w-full items-center space-x-2">
        <form className="flex w-full" onSubmit={sendMessage}>
          <Input ref={input} type="text" placeholder="Type your message..." />
          <Button type="submit" variant="ghost" size="lg" className="px-2">
            <Send className="text-black dark:text-white" />
          </Button>
        </form>
      </div>
    </SheetContent>
  );
}

export default function ChatButton() {
  const isOpen = useChat((state) => state.isOpen);

  function onOpenChange(open: boolean) {
    closeMenu();
    setChatState(open);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
