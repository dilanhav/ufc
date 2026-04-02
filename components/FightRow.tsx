"use client";

import Link from "next/link";
import { Fight } from "@/data/events";
import { Fighter } from "@/data/fighters";

function formatOdds(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

interface Props {
  fight: Fight;
  fighter1: Fighter;
  fighter2: Fighter;
}

export default function FightRow({ fight, fighter1: f1, fighter2: f2 }: Props) {
  return (
    <div className="relative group">
      <Link href={`/fight/${fight.id}`} className="absolute inset-0 z-0" aria-label={`${f1.name} vs ${f2.name}`} />

      <div className="relative flex items-stretch border-b border-white/5 group-hover:bg-white/[0.03] transition-colors duration-150 pointer-events-none">

        {/* Left fighter */}
        <div className="flex-1 flex items-center gap-3 py-4 px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {fight.fighter1Ranking && (
                <span className="text-red-500 text-xs font-bold">#{fight.fighter1Ranking}</span>
              )}
              <span className="text-gray-500 text-xs">{f1.nationality}</span>
            </div>
            <Link
              href={`/fighter/${f1.id}`}
              className="block hover:text-red-400 transition-colors pointer-events-auto relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white font-black text-lg uppercase leading-tight tracking-wide">
                {f1.firstName} {f1.lastName}
              </span>
            </Link>
            <div className="text-gray-600 text-xs mt-0.5">
              {f1.stats.wins}-{f1.stats.losses}{f1.stats.draws > 0 ? `-${f1.stats.draws}` : ""}
            </div>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center justify-center px-4 py-3 min-w-[140px]">
          {fight.isMainEvent && (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-1">
              Main Event
            </span>
          )}
          {fight.isCoMainEvent && (
            <span className="bg-gray-700 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-1">
              Co-Main
            </span>
          )}
          {fight.isTitleFight && (
            <span className="bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-1">
              Title
            </span>
          )}
          <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">vs</div>
          <div className="text-gray-600 text-[10px] uppercase tracking-wide">{fight.weightClass}</div>
          {fight.odds && (
            <div className="flex gap-2 mt-1.5">
              <span className={`text-xs font-bold ${fight.odds.fighter1American > 0 ? "text-green-500" : "text-gray-400"}`}>
                {formatOdds(fight.odds.fighter1American)}
              </span>
              <span className="text-gray-700 text-xs">·</span>
              <span className={`text-xs font-bold ${fight.odds.fighter2American > 0 ? "text-green-500" : "text-gray-400"}`}>
                {formatOdds(fight.odds.fighter2American)}
              </span>
            </div>
          )}
        </div>

        {/* Right fighter */}
        <div className="flex-1 flex items-center justify-end gap-3 py-4 px-5">
          <div className="min-w-0 text-right">
            <div className="flex items-center justify-end gap-2 mb-0.5">
              <span className="text-gray-500 text-xs">{f2.nationality}</span>
              {fight.fighter2Ranking && (
                <span className="text-blue-400 text-xs font-bold">#{fight.fighter2Ranking}</span>
              )}
            </div>
            <Link
              href={`/fighter/${f2.id}`}
              className="block hover:text-blue-400 transition-colors pointer-events-auto relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white font-black text-lg uppercase leading-tight tracking-wide">
                {f2.firstName} {f2.lastName}
              </span>
            </Link>
            <div className="text-gray-600 text-xs mt-0.5">
              {f2.stats.wins}-{f2.stats.losses}{f2.stats.draws > 0 ? `-${f2.stats.draws}` : ""}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center pr-4 text-gray-700 group-hover:text-gray-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
