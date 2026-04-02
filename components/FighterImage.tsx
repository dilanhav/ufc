"use client";

import { Fighter } from "@/data/fighters";
import { useState } from "react";

interface FighterImageProps {
  fighter: Fighter;
  side: "left" | "right";
  height?: number;
}

export default function FighterImage({
  fighter,
  side,
  height = 220,
}: FighterImageProps) {
  const [urlIndex, setUrlIndex] = useState(0);
  const urls = fighter.imageUrls ?? [];
  const currentUrl = urls[urlIndex];

  const handleError = () => {
    if (urlIndex < urls.length - 1) {
      setUrlIndex((i) => i + 1);
    } else {
      setUrlIndex(urls.length); // triggers fallback
    }
  };

  const showFallback = !currentUrl || urlIndex >= urls.length;

  if (showFallback) {
    return (
      <div
        className={`flex items-end justify-center`}
        style={{ height }}
      >
        <div
          className="rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center"
          style={{ width: height * 0.6, height: height * 0.85 }}
        >
          <span className="text-gray-500 font-black text-3xl">
            {fighter.firstName[0]}
            {fighter.lastName[0]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end justify-center`}
      style={{ height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentUrl}
        src={currentUrl}
        alt={fighter.name}
        style={{
          height: height,
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom",
          transform: side === "right" ? "scaleX(-1)" : "none",
          filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.7))",
        }}
        onError={handleError}
        crossOrigin="anonymous"
      />
    </div>
  );
}
