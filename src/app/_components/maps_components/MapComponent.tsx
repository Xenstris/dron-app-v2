"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Crosshair, Trash2, Undo, Target } from "lucide-react";
import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import { useGlobalProvider } from "../GlobalProvider";

interface Marker {
  id: string;
  position: google.maps.LatLngLiteral;
  timestamp: Date;
}

const defaultMapCenter = { lat: 52.4064, lng: 16.9252 };
const defaultMapZoom = 13;
const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 12rem)",
  borderRadius: "15px",
};
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [],
};

export default function MapComponent() {
  const { markers, setMarkers } = useGlobalProvider();
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [droneLocation, setDroneLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setIsLoading(false);
  }, []);

  const addMarker = useCallback(
    (position: google.maps.LatLngLiteral) => {
      if (!map) return;

      const newMarker: Marker = {
        id: Date.now().toString(),
        position,
        timestamp: new Date(),
      };

      setMarkers((prev: Marker[]) => [...prev, newMarker]); //
    },
    [map, setMarkers],
  );

  useEffect(() => {
    if (userLocation && map && !droneLocation) {
      map.setCenter(userLocation);
    } else if (droneLocation && map && !userLocation) {
      map.setCenter(droneLocation);
    }
  }, [userLocation, droneLocation, map]);

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      }
    },
    [addMarker],
  );

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(currentPosition);
          map?.setCenter(currentPosition);
          map?.setZoom(15);
          setIsLoading(false);
        },
        (error) => {
          console.error("Błąd pobierania lokalizacji:", error);
          setIsLoading(false);
        },
      );
    } else {
      console.error("Geolokalizacja nie jest wspierana.");
    }
  }, [map]);

  const removeLastMarker = useCallback(() => {
    setMarkers((prev) => {
      const newMarkers = [...prev];
      newMarkers.pop();
      return newMarkers;
    });
  }, []);

  const clearAllMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  const fetchDroneLocation =
    useCallback(async (): Promise<google.maps.LatLngLiteral | null> => {
      try {
        // Pobierz z Twojego endpointu API w Next.js
        const res = await fetch("/api/getDroneLocation", { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = (await res.json()) as {
          status: {
            latitude: number;
            longitude: number;
            abs_altitude: number;
            rel_altitude: number;
          };
        };

        return { lat: data.status.latitude, lng: data.status.longitude };
      } catch (err) {
        console.error(
          "Błąd podczas pobierania lub parsowania lokalizacji drona:",
          err,
        );
        return null;
      }
    }, []);

  useEffect(() => {
    if (!map) return; // czekamy na załadowanie mapy

    // 1) helper z fetch + setState + catch
    const updateDroneLocation = async () => {
      try {
        const loc = await fetchDroneLocation();
        if (loc) setDroneLocation(loc);
      } catch (error) {
        console.error("Błąd podczas aktualizacji pozycji drona:", error);
      }
    };

    // 2) od razu pierwsze pobranie i user location
    void updateDroneLocation();
    getCurrentLocation();

    // 3) polling co 2s
    const intervalId = setInterval(() => {
      void updateDroneLocation();
    }, 1000);

    // 4) cleanup
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const focusOnDrone = useCallback(() => {
    if (droneLocation && map) {
      map.setCenter(droneLocation);
      map.setZoom(15);
    } else {
      console.warn("Lokalizacja drona nie jest jeszcze dostępna.");
    }
  }, [droneLocation, map]);

  const focusOnUserLocation = useCallback(() => {
    if (userLocation && map) {
      map.setCenter(userLocation);
      map.setZoom(15);
    } else {
      getCurrentLocation();
    }
  }, [userLocation, map, getCurrentLocation]);

  return (
    <div className="relative h-[calc(100vh-12rem)] w-full overflow-hidden rounded-xl border border-slate-800/40 bg-black/40 backdrop-blur-md">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="relative">
              <Crosshair className="h-8 w-8 animate-pulse text-cyan-400" />
              <div className="absolute -inset-4 -z-10 animate-pulse rounded-full bg-cyan-500/20 blur-md" />
            </div>
            <p className="ml-3 text-slate-300">Ładowanie mapy...</p>
          </div>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, opacity: isLoading ? 0 : 1 }}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={mapOptions}
        onLoad={onMapLoad}
        onClick={onMapClick}
        mapTypeId="satellite"
      >
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "blue",
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: "white",
            }}
            title="Twoja lokalizacja"
          />
        )}
        {droneLocation && (
          <MarkerF
            position={droneLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE, // Zmieniono na kółko
              scale: 10, // Ustawiono skalę na 10, jak dla użytkownika
              fillColor: "red", // Zmieniono kolor wypełnienia na czerwony
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: "white", // Ustawiono kolor obramowania na biały, jak dla użytkownika
            }}
            title="Pozycja Drona"
          />
        )}
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={marker.position}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#00FFFF",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 7,
            }}
            onClick={() => {
              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div style="color: #242f3e; padding: 5px;">
                              <p style="margin: 0; font-weight: bold;">Punkt lokalizacji</p>
                              <p style="margin: 0; font-size: 12px;">${new Date(marker.timestamp).toLocaleString()}</p>
                              <p style="margin: 0; font-size: 12px;">${marker.position.lat.toFixed(6)}, ${marker.position.lng.toFixed(6)}</p>
                            </div>`,
              });
              if (map) {
                console.log("Clicked marker:", marker);
              }
            }}
          />
        ))}
        {markers.length > 1 && (
          <PolylineF
            path={markers.map((marker) => marker.position)}
            options={{
              geodesic: true,
              strokeColor: "#00FFFF",
              strokeOpacity: 0.8,
              strokeWeight: 3,
            }}
          />
        )}
      </GoogleMap>
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <Button
          onClick={focusOnDrone}
          className="relative overflow-hidden bg-blue-500/80 text-white transition-all duration-300 hover:bg-blue-600/90"
          size="icon"
        >
          <Target className="h-4 w-4" />
        </Button>
        <Button
          onClick={focusOnUserLocation}
          className="relative overflow-hidden bg-cyan-500/80 text-white transition-all duration-300 hover:bg-cyan-600/90"
          size="icon"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/30 to-cyan-600/30 opacity-0 blur-md transition-all duration-300 hover:opacity-100" />
          <Crosshair className="h-4 w-4" />
        </Button>

        <Button
          onClick={removeLastMarker}
          className="relative overflow-hidden bg-amber-500/80 text-white transition-all duration-300 hover:bg-amber-600/90"
          size="icon"
          disabled={markers.length === 0}
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-400/30 to-amber-600/30 opacity-0 blur-md transition-all duration-300 hover:opacity-100" />
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          onClick={clearAllMarkers}
          className="relative overflow-hidden bg-rose-500/80 text-white transition-all duration-300 hover:bg-rose-600/90"
          size="icon"
          disabled={markers.length === 0}
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-rose-400/30 to-rose-600/30 opacity-0 blur-md transition-all duration-300 hover:opacity-100" />
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
