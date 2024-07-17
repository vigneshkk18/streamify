import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import shortUUID from "short-unique-id";
import { Separator } from "@/components/ui/separator";

const { randomUUID } = new shortUUID({ length: 3, dictionary: "alpha_upper" });

export default function Home() {
  const [, navigate] = useLocation();
  const [roomId, setRoomId] = useState("");

  const onRoomClickHandler = () => {
    if (!roomId) {
      const roomId = `${randomUUID()}-${randomUUID()}-${randomUUID()}`;
      navigate(`/${roomId}/createe`);
    } else {
      navigate(`/${roomId}/joinee`);
    }
  };

  return (
    <main className="grid grid-cols-2 grid-rows-1 w-[calc(100vw-32px)] h-full mx-auto mb-4">
      <section className="rounded-l-md flex flex-col gap-4 items-center justify-center bg-black">
        <div className="flex flex-col gap-6 w-3/4">
          <h2 className="w-max p-4 rounded-xl bg-[#2196F3]/10 text-[#2196F3] font-bold">
            📺 Stream contents with ease.
          </h2>
          <h2 className="text-6xl font-bold">
            Seamless Streaming, Anywhere, Anytime
          </h2>
          <p>
            Stream your favorite video and audio content effortlessly between
            devices, even offline. Experience ultimate convenience with our
            cutting-edge streaming app
          </p>
          <div className="flex flex-col gap-12 items-center">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                value={roomId}
                onChange={({ target }) => setRoomId(target.value)}
                type="text"
                placeholder="Room ID"
              />
              <Button onClick={onRoomClickHandler} type="submit">
                Create Room
              </Button>
            </div>
            <div className="relative w-full">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-black px-4">
                OR
              </span>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <h3 className="font-bold text-xl">Stream Offline</h3>
              <div className="flex gap-6">
                <Link href="/offline/createe">
                  <Button>Start Streaming</Button>
                </Link>
                <Link href="/offline/joinee">
                  <Button variant="secondary">Receive Streaming</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[url('/bg.jpg')] bg-cover"></section>
    </main>
  );
}
