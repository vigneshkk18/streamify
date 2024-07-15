import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function home() {
  return (
    <main className="grid grid-cols-2 grid-rows-1 w-[calc(100vw-32px)] h-full mx-auto mb-4">
      <section className="rounded-l-md flex flex-col gap-4 items-center justify-center">
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
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Room ID" />
            <Button type="submit">Create Room</Button>
          </div>
        </div>
      </section>
      <section className="bg-[url('/bg.jpg')] bg-cover"></section>
    </main>
  );
}
