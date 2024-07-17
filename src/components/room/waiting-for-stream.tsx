import { Upload } from "@/assets/upload";

import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "../ui/input";
import { useRef } from "react";

interface WaitingForStream {
  onFileDrop: React.ChangeEventHandler<HTMLInputElement>;
}

export default function WaitingForStream({ onFileDrop }: WaitingForStream) {
  const input = useRef<HTMLInputElement>(null);

  const onClick = () => {
    if (!input.current) return;
    input.current.showPicker();
  };

  return (
    <div className="bg-background border p-8 rounded-lg flex flex-col gap-12">
      <CardContent
        onClick={onClick}
        className="cursor-pointer border border-dashed border-white rounded-md px-10 py-10 flex flex-col items-center gap-6"
      >
        <Input
          ref={input}
          onChange={onFileDrop}
          type="file"
          accept="audio/*,video/*"
          className="hidden"
        />
        <h3 className="text-xl">Drag and drop a file here or click here</h3>
        <Upload
          className="text-black dark:text-white"
          width="100"
          height="100"
        />
      </CardContent>
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-black px-4">
          OR
        </span>
      </div>
      <p className="text-center">
        Wait for the other person to start streaming.
      </p>
    </div>
  );
}
