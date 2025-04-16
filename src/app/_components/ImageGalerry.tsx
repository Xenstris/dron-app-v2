"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import clsx from "clsx";
import { getFolderImages } from "@/lib/getFolderImages";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface ImageGalleryProps {
  folderPath: string;
}

export function ImageGallery({ folderPath }: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [parent] = useAutoAnimate({ duration: 400 });

  useEffect(() => {
    setLoading(true);
    getFolderImages({ path: folderPath })
      .then((urls) => {
        setImages(urls);
      })
      .catch((err) => {
        console.error("Error downloading images:", err);
      })
      .finally(() => setLoading(false));
  }, [folderPath]);

  const navigateTo = (index: number, dir: "left" | "right") => {
    if (index === currentIndex) return;
    setDirection(dir);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    navigateTo(newIndex, "left");
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    navigateTo(newIndex, "right");
  };

  if (loading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <div className="absolute -inset-4 -z-10 animate-pulse rounded-full bg-cyan-500/20 blur-md" />
        </div>
        <p className="ml-3 text-slate-300">Loading images...</p>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex h-80 w-full items-center justify-center text-slate-300">
        No images in folder
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 opacity-50 blur-xl" />

      <div
        ref={parent}
        className="relative h-[60vh] max-h-[600px] min-h-[300px] w-full overflow-hidden rounded-lg border border-slate-800/60"
      >
        {images.map((url, index) => (
          <div
            key={url + index}
            className={clsx(
              "absolute inset-0 h-full w-full transition-all duration-500 ease-in-out",
              index === currentIndex ? "z-20 opacity-100" : "opacity-0",
            )}
            style={{
              transform:
                index === currentIndex
                  ? "translateX(0%)"
                  : direction === "left"
                    ? "translateX(-100%)"
                    : "translateX(100%)",
            }}
          >
            <Image
              src={url}
              alt={`Obraz ${index + 1}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="group absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-cyan-500/50"
        aria-label="Poprzedni obraz"
        disabled={false}
      >
        <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 blur-sm transition-all duration-300 group-hover:opacity-100" />
      </button>

      <button
        onClick={goToNext}
        className="group absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-cyan-500/50"
        aria-label="Następny obraz"
        disabled={false}
      >
        <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-0.5" />
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 blur-sm transition-all duration-300 group-hover:opacity-100" />
      </button>

      <div className="absolute right-4 bottom-4 z-30 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>

      <div className="mt-4 flex justify-center gap-2" ref={parent}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() =>
              navigateTo(index, index > currentIndex ? "right" : "left")
            }
            className={clsx(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-cyan-400"
                : "w-4 bg-slate-600 hover:bg-slate-400",
            )}
            aria-label={`Przejdź do obrazu ${index + 1}`}
            disabled={false}
          />
        ))}
      </div>
    </div>
  );
}
