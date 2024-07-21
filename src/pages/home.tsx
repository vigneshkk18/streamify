import { useState } from "react";
import { useLocation } from "wouter";
import shortUUID from "short-unique-id";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { TV } from "@/assets/tv";

const { randomUUID } = new shortUUID({ length: 3, dictionary: "alpha_upper" });

export default function Home() {
  const [, navigate] = useLocation();
  const [roomId, setRoomId] = useState("");

  const onRoomClickHandler = () => {
    if (!roomId) {
      const roomId = `${randomUUID()}-${randomUUID()}-${randomUUID()}`;
      navigate(`/${roomId}?peerType=createe`);
    } else {
      navigate(`/${roomId}?peerType=joinee`);
    }
  };

  return (
    <main className="grid  w-[calc(100vw-32px)] md:w-2/3 h-full mx-auto mb-4">
      <section className="rounded-l-md flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-col gap-6 w-3/4">
          <h2 className="w-max p-4 rounded-xl bg-primary/20 text-primary flex items-center font-bold">
            <TV svg={{ className: "pr-1" }} path={{ fill: "#2196F3" }} />
            Stream contents with ease.
          </h2>
          <h2 className="text-6xl font-bold">
            Seamless Streaming, Anywhere, Anytime
          </h2>
          <p>
            Stream your favorite video and audio content effortlessly between
            devices, even offline. Experience ultimate convenience with our
            cutting-edge streaming app
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              value={roomId}
              onChange={({ target }) => setRoomId(target.value)}
              type="text"
              placeholder="Room ID"
            />
            <Button onClick={onRoomClickHandler} type="submit">
              {roomId ? "Join Room" : "Create Room"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
