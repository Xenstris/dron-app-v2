"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { getFolderImages } from "@/lib/getFolderImages";

interface ImageGalleryProps {
  folderPath: string;
}

export function ImageGallery({ folderPath }: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFolderImages({ path: folderPath })
      .then((urls) => {
        setImages(urls);
      })
      .catch((err) => {
        console.error("Błąd pobierania obrazów:", err);
      })
      .finally(() => setLoading(false));
  }, [folderPath]);

  const goToPrevious = () => {
    if (isAnimating || images.length === 0) return;
    setDirection("left");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1,
      );
      setIsAnimating(false);
    }, 300);
  };

  const goToNext = () => {
    if (isAnimating || images.length === 0) return;
    setDirection("right");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
      setIsAnimating(false);
    }, 300);
  };

  if (loading) {
    return <div>Loading imgages...</div>;
  }

  if (!images.length) {
    return <div className="text-white">No images in folder</div>;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-slate-800">
        {images.map((url, index) => (
          <div
            key={url + index}
            className={clsx(
              "absolute inset-0 w-full transition-transform duration-300 ease-in-out",
              index === currentIndex ? "z-10" : "z-0",

              isAnimating && index === currentIndex && direction === "right"
                ? "-translate-x-full"
                : "",

              isAnimating && index === currentIndex && direction === "left"
                ? "translate-x-full"
                : "",

              isAnimating &&
                ((direction === "right" &&
                  index === (currentIndex + 1) % images.length) ||
                  (direction === "left" &&
                    index ===
                      (currentIndex - 1 + images.length) % images.length))
                ? "z-20 translate-x-0"
                : "",

              !isAnimating && index !== currentIndex && "translate-x-full",
            )}
          >
            <Image
              src={url}
              alt={`Location image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
        aria-label="Poprzedni obraz"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
        aria-label="Następny obraz"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
