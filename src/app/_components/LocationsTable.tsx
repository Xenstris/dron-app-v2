"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Clock, MapPin, Zap } from "lucide-react";
import { FaImage } from "react-icons/fa6";
import { SiGooglemaps } from "react-icons/si";
import { api } from "@/trpc/react";
import { ImageGallery } from "./ImageGalerry";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Coordinates {
  x: number;
  y: number;
}

interface Location {
  id: string;
  createdAt: Date;
  coordinates: Coordinates;
}

const formatDate = (data: Date) => {
  const date = new Date(data);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "medium",
  }).format(date);
};

function LocationName({ location }: { location: Location }) {
  const { data, isLoading } = api.googleMaps.getLocationByLatLong.useQuery(
    {
      latitude: location.coordinates.x,
      longitude: location.coordinates.y,
    },
    { staleTime: Infinity },
  );

  if (isLoading) {
    return <p className="text-muted-foreground text-xs">Loading...</p>;
  }

  if (data) {
    return <p className="text-muted-foreground text-xs">{data}</p>;
  }

  return (
    <p className="text-xs">
      {location.coordinates.x}, {location.coordinates.y}
    </p>
  );
}

function GoogleMapsLink({
  location,
  children,
}: {
  location: Location;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.x},${location.coordinates.y}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default function LocationsTable() {
  const [isLoading] = useState(false);

  const { data: locations } = api.locationSpots.getAll.useQuery(undefined, {
    refetchInterval: 5000,
  });

  return (
    <div className="w-full space-y-4">
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="relative">
            <Zap className="h-8 w-8 animate-pulse text-cyan-400" />
            <div className="absolute -inset-4 -z-10 animate-pulse rounded-full bg-cyan-500/20 blur-md" />
          </div>
          <p className="ml-3 text-slate-300">Loading locations...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations?.map((location) => (
            <div
              key={location.id}
              className="group relative overflow-hidden rounded-xl border border-slate-800/40 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-cyan-900/50 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

              <div className="flex items-center justify-between gap-4 p-4">
                <div
                  className="flex cursor-pointer items-center gap-3 transition-all duration-300"
                  onClick={() =>
                    console.log(`Navigate to location/${location.id}`)
                  }
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800/70">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 blur-sm transition-all duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(location.createdAt)}</span>
                    </div>
                    <div className="text-base font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
                      <LocationName location={location} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <GoogleMapsLink location={location}>
                    <Button
                      className="relative overflow-hidden bg-emerald-500/80 text-white transition-all duration-300 hover:bg-emerald-600/90"
                      size="icon"
                      variant="secondary"
                    >
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400/30 to-emerald-600/30 opacity-0 blur-md transition-all duration-300 hover:opacity-100" />
                      <SiGooglemaps className="h-4 w-4" />
                    </Button>
                  </GoogleMapsLink>

                  <Dialog>
                    <DialogTitle className="hidden"></DialogTitle>
                    <DialogTrigger asChild>
                      <Button
                        className="relative overflow-hidden bg-blue-500/80 text-white transition-all duration-300 hover:bg-blue-600/90"
                        size="icon"
                        variant="secondary"
                      >
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400/30 to-blue-600/30 opacity-0 blur-md transition-all duration-300 hover:opacity-100" />
                        <FaImage className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-slate-800 bg-black/90 backdrop-blur-xl">
                      <ImageGallery folderPath={`drone/${location.id}`} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
