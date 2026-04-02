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

// Styled silhouette placeholder — looks clean without a real photo
function Silhouette({ height, side, fighter }: { height: number; side: "left" | "right"; fighter: Fighter }) {
  const w = Math.round(height * 0.52);
  const h = Math.round(height * 0.92);
  return (
    <div className="flex items-end justify-center" style={{ height }}>
      <div
        className="relative flex flex-col items-center justify-end overflow-hidden"
        style={{ width: w, height: h }}
      >
        {/* Gradient background */}
        <div
          className={`absolute inset-0 ${side === "left" ? "bg-gradient-to-tr from-red-950/40 to-transparent" : "bg-gradient-to-tl from-blue-950/40 to-transparent"}`}
        />
        {/* SVG silhouette */}
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full opacity-25"
          style={{ transform: side === "right" ? "scaleX(-1)" : "none" }}
          fill="currentColor"
        >
          {/* Head */}
          <ellipse cx="50" cy="22" rx="14" ry="16" className={side === "left" ? "text-red-400" : "text-blue-400"} />
          {/* Neck */}
          <rect x="44" y="36" width="12" height="8" className={side === "left" ? "text-red-400" : "text-blue-400"} />
          {/* Torso */}
          <path d="M28 44 L72 44 L76 100 L24 100 Z" className={side === "left" ? "text-red-400" : "text-blue-400"} />
          {/* Left arm */}
          <path d="M28 46 L12 90 L18 92 L34 50 Z" className={side === "left" ? "text-red-400" : "text-blue-400"} />
          {/* Right arm */}
          <path d="M72 46 L88 90 L82 92 L66 50 Z" className={side === "left" ? "text-red-400" : "text-blue-400"} />
          {/* Left leg */}
          <path d="M36 100 L28 170 L40 170 L50 110 Z" className={side === "left" ? "text-red-400" : "text-blue-400"} />
          {/* Right leg */}
          <path d="M64 100 L72 170 L60 170 L50 110 Z" className={side === "left" ? "text-red-400" : "text-blue-400"} />
        </svg>
        {/* Name overlay */}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
            {fighter.lastName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FighterImage({
  fighter,
  side,
  height = 220,
  className = "",
}: FighterImageProps) {
  const urls = fighter.imageUrls ?? [];
  const [urlIndex, setUrlIndex] = useState(0);
  const allFailed = urlIndex >= urls.length;
  const currentUrl = !allFailed ? proxied(urls[urlIndex]) : null;

  const handleError = () => setUrlIndex((i) => i + 1);

  if (allFailed || !currentUrl) {
    return (
      <div className={className}>
        <Silhouette height={height} side={side} fighter={fighter} />
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
