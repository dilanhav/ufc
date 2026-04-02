"use client";

import { Fighter } from "@/data/fighters";
import { useEffect, useRef, useState } from "react";

interface Props {
  fighter1: Fighter;
  fighter2: Fighter;
  weightClass: string;
  isMainEvent: boolean;
  isCoMainEvent: boolean;
  isTitleFight: boolean;
  titleType?: string;
  eventDate: string;
  eventVenue: string;
}

function proxied(url: string) {
  return `/api/fighter-image?url=${encodeURIComponent(url)}`;
}

function FaceImage({ fighter, side }: { fighter: Fighter; side: "left" | "right" }) {
  const urls = fighter.imageUrls ?? [];
  const [idx, setIdx] = useState(0);
  const failed = idx >= urls.length;

  if (failed) {
    // Artistic placeholder — big faded letter + gradient
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div
          className={`absolute inset-0 text-[28vw] font-black flex items-center justify-center opacity-[0.06] select-none pointer-events-none ${side === "left" ? "text-red-400" : "text-blue-400"}`}
        >
          {fighter.lastName[0]}
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={proxied(urls[idx])}
      src={proxied(urls[idx])}
      alt={fighter.name}
      className="w-full h-full"
      style={{
        objectFit: "cover",
        objectPosition: "50% 8%",   // crop to face/upper-body area
        transform: side === "right" ? "scaleX(-1)" : "none",
      }}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

export default function FightHero({
  fighter1,
  fighter2,
  weightClass,
  isMainEvent,
  isCoMainEvent,
  isTitleFight,
  titleType,
  eventDate,
  eventVenue,
}: Props) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!heroRef.current) return;
      const h = heroRef.current.offsetHeight;
      const fade = Math.max(0, 1 - window.scrollY / (h * 0.6));
      heroRef.current.style.opacity = String(fade);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden"
      style={{ height: "65vh", minHeight: 420 }}
    >
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-gradient-to-br from-red-950 via-red-950/60 to-black/10" />
        <div className="flex-1 bg-gradient-to-bl from-blue-950 via-blue-950/60 to-black/10" />
      </div>

      {/* Fighter images — each takes half the width */}
      <div className="absolute inset-0 flex">
        {/* Fighter 1 — left */}
        <div className="flex-1 relative overflow-hidden">
          <FaceImage fighter={fighter1} side="left" />
          {/* Fade edge towards center */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70 pointer-events-none" />
          {/* Fade left edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Fighter 2 — right */}
        <div className="flex-1 relative overflow-hidden">
          <FaceImage fighter={fighter2} side="right" />
          {/* Fade edge towards center */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/70 pointer-events-none" />
          {/* Fade right edge */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* VS circle — centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/70 border border-white/10 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-sm">
          <span className="text-white font-black text-base tracking-wider">VS</span>
        </div>
      </div>

      {/* Info overlay — anchored to bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end">
        {/* Fighter 1 */}
        <div className="flex-1 px-5 pb-7 text-left">
          {fighter1.ranking && (
            <div className="text-red-400 text-xs font-bold mb-0.5">#{fighter1.ranking} Ranked</div>
          )}
          <div className="text-white/80 font-bold text-lg leading-none uppercase tracking-wide">
            {fighter1.firstName}
          </div>
          <div className="text-red-400 font-black text-4xl leading-none uppercase tracking-tight">
            {fighter1.lastName}
          </div>
          <div className="text-gray-400 text-xs mt-2">
            {fighter1.nationality} {fighter1.stats.country}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">
            {fighter1.stats.wins}W · {fighter1.stats.losses}L
          </div>
        </div>

        {/* Center info */}
        <div className="px-4 pb-7 flex flex-col items-center gap-1.5 min-w-[130px]">
          {isTitleFight && (
            <span className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              {titleType ?? "Title"} Fight
            </span>
          )}
          {isMainEvent && (
            <span className="bg-red-700 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              Main Event
            </span>
          )}
          {isCoMainEvent && !isMainEvent && (
            <span className="bg-gray-700 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              Co-Main
            </span>
          )}
          <div className="text-gray-500 text-[9px] font-bold uppercase tracking-widest text-center mt-1">
            {weightClass}
          </div>
          <div className="text-gray-600 text-[9px] text-center">{eventVenue}</div>
          <div className="text-gray-600 text-[9px] text-center">{eventDate}</div>
        </div>

        {/* Fighter 2 */}
        <div className="flex-1 px-5 pb-7 text-right">
          {fighter2.ranking && (
            <div className="text-blue-400 text-xs font-bold mb-0.5">#{fighter2.ranking} Ranked</div>
          )}
          <div className="text-white/80 font-bold text-lg leading-none uppercase tracking-wide">
            {fighter2.firstName}
          </div>
          <div className="text-blue-400 font-black text-4xl leading-none uppercase tracking-tight">
            {fighter2.lastName}
          </div>
          <div className="text-gray-400 text-xs mt-2">
            {fighter2.nationality} {fighter2.stats.country}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">
            {fighter2.stats.wins}W · {fighter2.stats.losses}L
          </div>
        </div>
      </div>
    </div>
  );
}
