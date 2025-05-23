"use client";

import { Slider } from "@/components/ui/slider";
import MapComponent from "../_components/maps_components/MapComponent";
import { MapProvider } from "../_components/maps_components/MapProvider";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGlobalProvider } from "../_components/GlobalProvider";
import { type Waypoint } from "../api/addMissionWaypoints/route";
import { toast } from "sonner";

type droneState = {
  status: string;
};

export default function Home() {
  const [sliderValue, setSliderValue] = useState<number[]>([5]);
  const [droneState, setDroneState] = useState("NO_GPS_FIX"); // Początkowy stan
  const [waypointsSet, setWaypointsSet] = useState(false);
  const [missionPaused, setMissionPaused] = useState(false);
  const { markers } = useGlobalProvider();
  const DRONE_STATUS_ENDPOINT = "/api/getDroneState";

  const handleReturnToLaunch = useCallback(async () => {
    try {
      const response = await fetch("/api/returnToLaunch", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to return to launch:", errorText);
        toast.error("Błąd podczas powrotu do startu.");
      } else {
        console.log("Drone returned to launch successfully.");
        toast.success("Dron wraca do startu.");
      }
    } catch (error) {
      console.error("Error returning to launch:", error);
      toast.error("Wystąpił błąd podczas powrotu do startu.");
    }
  }, []);

  const handlePauseMission = useCallback(async () => {
    try {
      const response = await fetch("/api/pauseMission", {
        method: "POST",
        cache: "no-store", // Wyłącza buforowanie
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to pause mission:", errorText);
        toast.error("Błąd podczas pauzy misji.");
      } else {
        console.log("Mission paused successfully.");
        toast.success("Misja wstrzymana pomyślnie.");
        setMissionPaused(true);
      }
    } catch (error) {
      console.error("Error pausing mission:", error);
      toast.error("Wystąpił błąd podczas pauzy misji.");
    }
  }, []);

  const handleResumeMission = useCallback(async () => {
    try {
      const response = await fetch("/api/resumeMission", {
        method: "POST",
        cache: "no-store", // Wyłącza buforowanie
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to resume mission:", errorText);
        toast.error("Błąd podczas wznowienia misji.");
      } else {
        console.log("Mission resumed successfully.");
        toast.success("Misja wznowiona pomyślnie.");
        setMissionPaused(false);
      }
    } catch (error) {
      console.error("Error resuming mission:", error);
      toast.error("Wystąpił błąd podczas wznowienia misji.");
    }
  }, []);

  const handleStartMission = useCallback(async () => {
    try {
      const response = await fetch("/api/startMission", {
        method: "POST",
        cache: "no-store", // Wyłącza buforowanie
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to start mission:", errorText);
        toast.error("Błąd podczas rozpoczęcia misji.");
      } else {
        console.log("Mission started successfully.");
        toast.success("Misja rozpoczęta pomyślnie.");
        setMissionPaused(false);
      }
    } catch (error) {
      console.error("Error starting mission:", error);
      toast.error("Wystąpił błąd podczas rozpoczęcia misji.");
    }
  }, []);

  const handleUploadWaypoints = useCallback(async () => {
    // Sprawdzenie, czy sliderValue[0] jest liczbą i nie jest NaN
    if (typeof sliderValue[0] !== "number" || isNaN(sliderValue[0])) {
      alert(
        "Wartość wysokości drona jest nieprawidłowa. Ustaw ją za pomocą suwaka.",
      );
      return;
    }

    const attitude = sliderValue[0]; // Poprawiona nazwa zmiennej na attitude

    // Przekształć markery z kontekstu do formatu Waypoint[]
    // Pamiętaj, że Marker w GlobalProvider ma { id, position, timestamp },
    // a Waypoint ma { lat, lon, alt }. Musisz zrobić mapowanie.
    const waypointsToSend: Waypoint[] = markers.map((marker) => ({
      lat: marker.position.lat,
      lon: marker.position.lng, // google.maps.LatLngLiteral używa 'lng', a Twój Waypoint 'lon'
      alt: attitude, // Użycie wartości z suwaka jako wysokości
    }));

    // Dodaj walidację, jeśli tablica markerów jest pusta
    if (waypointsToSend.length === 0) {
      toast.error("Brak punktów do wysłania. Dodaj punkty na mapie.");
      return;
    }

    try {
      const response = await fetch("/api/addMissionWaypoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(waypointsToSend), // Wysyłaj przetworzone markery
      });

      if (!response.ok) {
        // Bezpieczne przypisanie odpowiedzi JSON
        const errorData: unknown = await response.json(); // Użyj unknown
        console.error("Failed to upload waypoints:", errorData); // Loguj cały obiekt, nie tylko .error
        // Sprawdź, czy errorData ma właściwość 'error'
        const errorMessage =
          typeof errorData === "object" &&
          errorData !== null &&
          "error" in errorData
            ? (errorData as { error: string }).error
            : response.statusText;
        alert(`Błąd podczas wysyłania waypointów: ${errorMessage}`);
      } else {
        // Bezpieczne przypisanie odpowiedzi JSON
        const data: unknown = await response.json(); // Użyj unknown
        console.log("Waypoints uploaded successfully:", data);
        toast.success("Waypoints uploaded successfully.");
        setWaypointsSet(true);
        // Opcjonalnie: Po wysłaniu możesz wyczyścić markery na mapie
        // setMarkers([]);
      }
    } catch (error) {
      console.error("Error sending waypoints:", error);
      toast.error("Wystąpił błąd sieciowy podczas wysyłania waypointów.");
    }
  }, [markers, sliderValue]); // Dodaj sliderValue do zależności useCallback

  useEffect(() => {
    const fetchDroneStatus = async () => {
      try {
        const response = await fetch(DRONE_STATUS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json()) as droneState;
        setDroneState(data.status);
      } catch (error) {
        console.error("Failed to fetch drone status:", error);
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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <MapProvider>
        <MapComponent />
      </MapProvider>
      <div className="transform bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-2xl font-extrabold text-transparent transition">
        Drone state: {droneState}
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex w-full justify-center space-x-4">
          <Button
            className="w-48 rounded-md border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-blue-300 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:border-blue-500 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800"
            disabled={droneState !== "READY_FOR_TAKEOFF"}
            onClick={handleUploadWaypoints}
          >
            Upload waypoints
          </Button>
          <Button
            className="w-48 rounded-md border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-blue-300 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:border-blue-500 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800"
            disabled={!waypointsSet && droneState === "READY_FOR_TAKEOFF"}
            onClick={handleStartMission}
          >
            Launch
          </Button>
        </div>
        <div className="flex w-full justify-center space-x-4">
          {missionPaused ? (
            <Button
              className="w-48 rounded-md border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-blue-300 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:border-blue-500 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800"
              disabled={droneState !== "MISSION_IN_PROGRESS"}
              onClick={handleResumeMission}
            >
              Resume mission
            </Button>
          ) : (
            <Button
              className="w-48 rounded-md border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-blue-300 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:border-blue-500 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800"
              disabled={droneState !== "MISSION_IN_PROGRESS"}
              onClick={handlePauseMission}
            >
              Pause mission
            </Button>
          )}
          <Button
            className="w-48 rounded-md border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-blue-300 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:border-blue-500 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800"
            onClick={handleReturnToLaunch}
          >
            Return to base
          </Button>
        </div>
      </div>

      <Slider
        defaultValue={[5]}
        max={30}
        min={5}
        step={1}
        rangeClassName="bg-indigo-500"
        thumbClassName="bg-white"
        className="w-[60%]"
        onValueChange={setSliderValue}
      />
      <div className="transform bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-xl font-extrabold text-transparent">
        Set drone attitude of fly: {sliderValue[0]} [m]
      </div>
    </div>
  );
}
