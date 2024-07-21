import { Link } from "wouter";

import Menu from "@/components/room/menu";

export default function Header() {
  return (
    <header className="m-4 md:py-3 md:px-4 rounded-md flex justify-between gap-2">
      <div className="flex">
        <Menu />
        <Link className="flex gap-2 items-center" to="/">
          <img src="/logo.png" alt="Logo" className="w-7 h-7" />
          <h1 className="text-xl font-bold">Streamify</h1>
        </Link>
      </div>
    </header>
  );
}
