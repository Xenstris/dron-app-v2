import Link from "next/link";

export default function TopBarNav() {
  return (
    <div className="w-full rounded-md border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="transform bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-2xl font-extrabold text-transparent transition duration-300 hover:scale-110 hover:from-blue-500 hover:to-cyan-700">
            DronAppV2
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/map"
            className="transform text-lg font-semibold text-blue-300 transition duration-300 hover:scale-105 hover:text-blue-400"
          >
            Map
          </Link>
          <Link
            href="/about"
            className="transform text-lg font-semibold text-blue-300 transition duration-300 hover:scale-105 hover:text-blue-400"
          >
            Placeholder
          </Link>
        </nav>
      </div>
    </div>
  );
}
