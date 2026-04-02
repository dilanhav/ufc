"use client";

import { useState } from "react";
import { FightNight } from "@/data/events";
import { FIGHTERS } from "@/data/fighters";
import FightRow from "./FightRow";

interface Props {
  event: FightNight;
}

export default function EventCard({ event }: Props) {
  const [showPrelims, setShowPrelims] = useState(false);
  const mainCard = event.fights.filter((f) => f.isMainCard);
  const prelims = event.fights.filter((f) => !f.isMainCard);

  return (
    <section>
      {/* Event header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
              {event.shortName}
            </span>
            <span className="text-gray-500 text-sm">{event.date}</span>
          </div>
          <h2 className="text-white font-black text-2xl leading-tight">{event.name}</h2>
          <p className="text-gray-600 text-sm mt-0.5">
            {event.venue} · {event.location}
          </p>
        </div>
        <span className="text-gray-600 text-xs">{event.broadcast}</span>
      </div>

      {event.fights.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-8 text-center text-gray-600 text-sm">
          Card to be announced
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {/* Main Card */}
          {mainCard.length > 0 && (
            <>
              <div className="px-5 py-2 bg-white/[0.03] flex items-center gap-2 border-b border-white/5">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  Main Card
                </span>
                <span className="text-gray-700 text-[10px]">·</span>
                <span className="text-gray-600 text-[10px]">{event.broadcast}</span>
              </div>
              {mainCard.map((f) => {
                const f1 = FIGHTERS[f.fighter1Id];
                const f2 = FIGHTERS[f.fighter2Id];
                if (!f1 || !f2) return null;
                return <FightRow key={f.id} fight={f} fighter1={f1} fighter2={f2} />;
              })}
            </>
          )}

          {/* Prelims toggle */}
          {prelims.length > 0 && (
            <>
              <button
                onClick={() => setShowPrelims((s) => !s)}
                className="w-full px-5 py-3 flex items-center gap-2 border-t border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  {showPrelims ? "▲ Hide" : "▼"} Prelims · {prelims.length} fights
                </span>
              </button>
              {showPrelims &&
                prelims.map((f) => {
                  const f1 = FIGHTERS[f.fighter1Id];
                  const f2 = FIGHTERS[f.fighter2Id];
                  if (!f1 || !f2) return null;
                  return <FightRow key={f.id} fight={f} fighter1={f1} fighter2={f2} />;
                })}
            </>
          )}
        </div>
      )}
    </section>
  );
}
