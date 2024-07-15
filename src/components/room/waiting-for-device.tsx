import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WaitingForDevice() {
  return (
    <div className="bg-background border p-8 rounded-lg">
      <h3 className="text-2xl font-bold">
        Waiting for the other device to join the room.
      </h3>
      <p className="text-center mt-12">
        Please open this
        <Tooltip>
          <TooltipTrigger className="bg-slate-600 rounded font-mono p-1 mx-2 cursor-pointer">
            link
          </TooltipTrigger>
          <TooltipContent>
            <p>http://localhost:5173/ABC-DEF-GHI</p>
          </TooltipContent>
        </Tooltip>
        in the other device
      </p>
    </div>
  );
}
