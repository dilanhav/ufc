"use client";

import { Fighter } from "@/data/fighters";
import { useState } from "react";

interface FighterImageProps {
  fighter: Fighter;
  side: "left" | "right";
  height?: number;
  className?: string;
}

function proxied(url: string) {
  return `/api/fighter-image?url=${encodeURIComponent(url)}`;
}

export default function FighterImage({
  fighter,
  side,
  height = 220,
  className = "",
}: FighterImageProps) {
  const urls = fighter.imageUrls ?? [];
  const [urlIndex, setUrlIndex] = useState(0);
  const currentUrl = urls[urlIndex] ? proxied(urls[urlIndex]) : null;
  const failed = !currentUrl;

  const handleError = () => {
    if (urlIndex < urls.length - 1) setUrlIndex((i) => i + 1);
    else setUrlIndex(urls.length);
  };

  if (failed) {
    return (
      <div className={`flex items-end justify-center ${className}`} style={{ height }}>
        <div
          className="rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center"
          style={{ width: Math.round(height * 0.55), height: Math.round(height * 0.85) }}
        >
          <span className="text-gray-500 font-black text-3xl">
            {fighter.firstName[0]}{fighter.lastName[0]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end justify-center ${className}`} style={{ height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentUrl}
        src={currentUrl}
        alt={fighter.name}
        style={{
          height,
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom",
          transform: side === "right" ? "scaleX(-1)" : "none",
          filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.8))",
        }}
        onError={handleError}
      />
    </div>
  );
}
