import { Upload } from "@/assets/upload";

import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function WaitingForStream() {
  return (
    <div className="bg-background border p-8 rounded-lg flex flex-col gap-12">
      <CardContent className="border border-dashed border-white rounded-md px-10 py-10 flex flex-col items-center gap-6">
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
