import Link from "next/link";

export default function TopBarNav() {
  return (
    <div className="w-full p-2">
      <div className="bg-background flex h-14 w-full items-center justify-between rounded-xl border p-2 shadow-md shadow-black/5">
        <div className="flex items-center space-x-2">
          <Link href="/" className="mr-6 flex items-center space-x-2 p-4">
            <span className="font-bold">DronAppV2</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/browse"
              className="hover:text-foreground/80 text-foreground transition-colors"
            >
              Browse
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
