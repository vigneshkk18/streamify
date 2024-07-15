import { Cross } from "@/assets/cross";
import { Leave } from "@/assets/leave";
import { Menu as MenuIcon } from "@/assets/menu";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ChatButton from "@/components/room/chat";
import { Separator } from "@/components/ui/separator";

export default function Menu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="sm:hidden">
          <MenuIcon className="text-black dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full flex flex-col items-center justify-center"
      >
        <SheetClose>
          <Cross />
        </SheetClose>
        <ChatButton />
        <Separator />
        <Button variant="destructive" size="lg" className="w-full">
          <Leave className="mr-2 text-black dark:text-white" /> Leave Room
        </Button>
      </SheetContent>
    </Sheet>
  );
}
