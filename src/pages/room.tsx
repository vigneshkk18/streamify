import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ChatButton from "@/components/room/chat";
import RoomControls from "@/components/room/room-controls";
import WaitingForStream from "@/components/room/waiting-for-stream";
import WaitingForDevice from "@/components/room/waiting-for-device";
import OfflineConnectSteps from "@/components/room/offline-connect-steps";

export default function Room() {
  return (
    <>
      <main className="w-[calc(100vw-32px)] flex-grow mx-auto grid place-items-center">
        {/* <WaitingForDevice /> */}
        {/* <OfflineConnectSteps /> */}
        {/* <WaitingForStream /> */}
        {/* <video src="/video.mp4" className="w-full max-w-[100vh]" /> */}
      </main>
    </>
  );
}
