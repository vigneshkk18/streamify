import { Link } from "wouter";
import Menu from "@/components/room/menu";

export default function Header() {
  return (
    <header className="m-4 py-3 px-4 bg-background rounded-md flex gap-2">
      <Menu />
      <Link className="flex gap-2 items-center" to="/">
        <img src="/logo-no-bg.png" alt="Logo" className="w-7 h-7" />
        <h1 className="text-xl font-bold">Streamify</h1>
      </Link>
    </header>
  );
}
