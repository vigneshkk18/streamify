import { Button } from "@/components/ui/button";

export default function OfflineConnectSteps() {
  return (
    <div className="bg-background border p-8 rounded-lg">
      <h4 className="text-xl font-bold">
        Please Complete All the Steps to connect devices.
      </h4>
      <ul className="px-4 flex flex-col gap-4 mt-6">
        <li className="flex flex-wrap items-center gap-2">
          <span className="w-4 h-4 border border-white rounded-full"></span>
          <span className="w-4 h-4 border bg-green-500 rounded-full"></span>
          <span>Scan the Other Device's QR Code.</span>
          <Button>Open Camera</Button>
        </li>
        <li className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border border-white rounded-full"></span>
            <span className="w-4 h-4 border bg-green-500 rounded-full"></span>
            <span>Scan this QR Code in the other device.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4"></span>
            <img
              src="/qr.png"
              width={250}
              height={250}
              alt="Connection QRCode"
            />
          </div>
        </li>
      </ul>
    </div>
  );
}
