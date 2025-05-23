"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

type connectionData = {
  status: string;
};

export default function TopBarNav() {
  const [droneStatus, setDroneStatus] = useState("CONNECTED");
  const DRONE_STATUS_ENDPOINT = "/api/getConnectionState";

  useEffect(() => {
    const fetchDroneStatus = async () => {
      try {
        const response = await fetch(DRONE_STATUS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json()) as connectionData;
        setDroneStatus(data.status);
      } catch (error) {
        console.error("Failed to fetch drone status:", error);
        setDroneStatus("ERROR"); // Możesz ustawić status błędu w przypadku problemów z API
      }
    };
    fetchDroneStatus().catch((error) =>
      console.error("Initial fetch failed:", error),
    );

    const interval = setInterval(() => {
      fetchDroneStatus().catch((error) =>
        console.error("Interval fetch failed:", error),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []); // Pusta tablica zależności oznacza, że useEffect uruchomi się tylko raz po zamontowaniu

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
      {(droneStatus === "NOT_CONNECTED" || droneStatus === "ERROR") && (
        <div className="py-1 text-center font-bold text-red-500">
          DRONE STATUS: {droneStatus}
        </div>
      )}
    </div>
  );
}
