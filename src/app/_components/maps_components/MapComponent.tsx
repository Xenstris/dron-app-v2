"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Crosshair, Trash2, Undo, Target } from "lucide-react";
import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";

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
  const [markers, setMarkers] = useState<Marker[]>([]);
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

      setMarkers((prev) => [...prev, newMarker]);
    },
    [map],
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

  const showMarkersData = useCallback(() => {
    console.log("--- Dane Markerów ---");
    markers.forEach((marker) => {
      console.log(
        `ID: ${marker.id}, Pozycja: { lat: ${marker.position.lat}, lng: ${marker.position.lng} }, Czas: ${marker.timestamp.toLocaleString()}`,
      );
    });
    if (markers.length === 0) {
      console.log("Brak zapisanych markerów.");
    }
    console.log("----------------------");
  }, [markers]);

  const fetchDroneLocation =
    useCallback(async (): Promise<google.maps.LatLngLiteral | null> => {
      // Symulacja pobierania danych z API
      return new Promise((resolve) => {
        setTimeout(() => {
          // Zamockowane dane - zastąp to prawdziwym wywołaniem API
          const mockDronePosition: google.maps.LatLngLiteral = {
            lat: 52.408,
            lng: 16.915,
          };
          resolve(mockDronePosition);
        }, 1000); // Symulacja opóźnienia 1 sekundy
      });
    }, []);

  useEffect(() => {
    const getInitialDroneLocation = async () => {
      const location = await fetchDroneLocation();
      if (location) {
        setDroneLocation(location);
      }
    };

    getInitialDroneLocation().catch((error) => {
      console.error("Błąd podczas pobierania lokalizacji drona:", error);
    });
    getCurrentLocation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDroneLocation, map]);

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

        <Button
          onClick={showMarkersData}
          className="bg-gray-500/80 text-white transition-all duration-300 hover:bg-gray-600/90"
        >
          Pokaż Markery
        </Button>
      </div>
    </div>
  );
}
