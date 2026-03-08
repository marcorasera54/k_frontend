"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop";

interface ImageCarouselProps {
  images?: string[];
  alt: string;
  className?: string;
  interval?: number;
}

export default function ImageCarousel({
  images,
  alt,
  className = "",
  interval = 4000,
}: ImageCarouselProps) {
  const slides = images && images.length > 0 ? images : [DEFAULT_IMAGE];
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timerRef.current!);
  }, [slides.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dots — only if more than one image */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
