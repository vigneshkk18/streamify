import { useRef } from "react";
import { FileDrop } from "react-file-drop";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Upload } from "@/assets/upload";

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
    <div className="p-8 rounded-lg flex flex-col gap-12">
      <FileDrop
        className="file-drop"
        onTargetClick={onClick}
        onDrop={(files, ev) => {
          ev.preventDefault();
          // @ts-expect-error any
          onFileDrop({ ...ev, target: { ...ev.target, files } });
        }}
        dropEffect={"copy"}
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
      </FileDrop>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <Separator className="bg-black dark:bg-white" />
        <span className="px-4">OR</span>
        <Separator className="bg-black dark:bg-white" />
      </div>
      <p className="text-center">
        Wait for the other person to start streaming.
      </p>
    </div>
  );
}
