import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import TopBarNav from "./_components/TopNavBar";
import { GlobalProvider } from "./_components/GlobalProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <Suspense>
            <NuqsAdapter>
              <GlobalProvider>
                <div className="min-h-screen space-y-4 bg-gradient-to-b from-slate-950 from-30% to-black to-95% p-2">
                  <TopBarNav />
                  {children}
                  <Toaster position="top-center" richColors />
                </div>
              </GlobalProvider>
            </NuqsAdapter>
          </Suspense>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
