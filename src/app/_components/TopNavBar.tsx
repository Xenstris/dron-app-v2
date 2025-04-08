import Link from "next/link";

// export default function TopBarNav() {
//   return (
//     <div className="w-full p-2">
//       <div className="bg-background flex h-14 w-full items-center justify-between rounded-xl border p-2 shadow-md shadow-black/5">
//         <div className="flex items-center">
//           <Link href="/" className="mr-6 flex items-center p-4">
//             <span className="font-bold">Placeholder</span>
//           </Link>
//           <nav className="flex items-center text-sm font-medium">
//             <Link
//               href="/browse"
//               className="hover:text-foreground/80 text-foreground transition-colors"
//             >
//               Placeholder
//             </Link>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function TopBarNav() {
  return (
    <div className="mx-auto w-full max-w-4xl p-2">
      <div className="relative max-h-[100px] w-full overflow-hidden rounded-xl border border-slate-800/40 bg-black/40 p-2 backdrop-blur-md">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 opacity-50 blur-xl" />

        <div className="ml-5 flex items-center justify-start gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="transform bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent transition duration-300 hover:scale-110 hover:from-blue-500 hover:to-cyan-700">
              DronAppV2
            </span>
          </Link>
          <Link href="/map" className="flex items-center gap-2">
            <span className="transform font-bold text-blue-300 transition duration-300 hover:scale-110 hover:text-blue-400">
              Map
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
