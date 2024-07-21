import { useState } from "react";
import { useLocation, useRoute } from "wouter";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatButton from "@/components/room/chat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import useSearchParams from "@/hooks/useSearchParams";
import { exitRoom, useManager } from "@/hooks/useManager";
import { closeMenu, setMenu, useMenu } from "@/hooks/useMenu";
import { killStream, useStreamManager } from "@/hooks/useStreamManager";

import { Leave } from "@/assets/leave";
import { Square } from "@/assets/square";
import { Menu as MenuIcon } from "@/assets/menu";

export default function Menu() {
  const isOpen = useMenu();
  const [disabled, setDisabled] = useState(false);
  const [, params] = useRoute<{ roomId: string }>("/:roomId");
  const searchParams = useSearchParams<{ peerType: "createe" | "joinee" }>();
  const [, navigate] = useLocation();
  const { isStreaming } = useStreamManager();
  const { isReady } = useManager();

  async function onStopStream() {
    setDisabled(true);
    if (!params?.roomId) return;
    killStream();
    closeMenu();
    setDisabled(false);
  }

  async function onLeaveRoom() {
    const peerType = searchParams?.peerType;
    if (
      !params?.roomId ||
      !peerType ||
      (peerType !== "createe" && peerType !== "joinee")
    )
      return;
    setDisabled(true);
    exitRoom(params?.roomId, peerType);
    setDisabled(false);
    closeMenu();
    navigate("/");
  }

  if (!isReady) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setMenu}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="sm:hidden">
          <MenuIcon className="text-black dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        aria-description="Room Options"
        className="w-full flex flex-col items-center justify-center"
      >
        <SheetHeader>
          <SheetTitle className="mb-4">Room Options</SheetTitle>
        </SheetHeader>
        <ChatButton />
        {isStreaming && (
          <>
            <Separator />
            <Button
              variant="destructive"
              size="lg"
              onClick={onStopStream}
              disabled={disabled}
              className="w-full"
            >
              <Square className="mr-2 text-white" />
              Stop Streaming
            </Button>
          </>
        )}
        <Separator />
        <Button
          onClick={onLeaveRoom}
          disabled={disabled}
          variant="destructive"
          size="lg"
          className="w-full"
        >
          <Leave className="mr-2 text-white" /> Leave Room
        </Button>
      </SheetContent>
    </Sheet>
  );
}
