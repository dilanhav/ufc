"use client";

import Image from "next/image";
import { Fighter } from "@/data/fighters";
import { useState } from "react";

interface TaleOfTapeProps {
  fighter1: Fighter;
  fighter2: Fighter;
}

function FighterImage({
  fighter,
  side,
}: {
  fighter: Fighter;
  side: "left" | "right";
}) {
  const [failed, setFailed] = useState(false);

  if (!fighter.imageUrl || failed) {
    return (
      <div
        className={`flex items-end justify-center h-56 ${side === "left" ? "pr-4" : "pl-4"}`}
      >
        <div className="w-28 h-48 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
          <span className="text-gray-500 text-4xl font-black">
            {fighter.firstName[0]}
            {fighter.lastName[0]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-end justify-center h-56 ${side === "left" ? "pr-4" : "pl-4"}`}
    >
      <Image
        src={fighter.imageUrl}
        alt={fighter.name}
        width={160}
        height={224}
        className="object-contain object-bottom drop-shadow-2xl"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  );
}

function StatRow({
  label,
  val1,
  val2,
  highlight1,
  highlight2,
}: {
  label: string;
  val1: string | number;
  val2: string | number;
  highlight1?: boolean;
  highlight2?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 items-center py-2 border-b border-gray-800 text-sm">
      <span
        className={`font-bold text-right pr-4 ${highlight1 ? "text-red-400" : "text-white"}`}
      >
        {val1}
      </span>
      <span className="text-gray-500 text-center text-xs uppercase tracking-widest font-medium">
        {label}
      </span>
      <span
        className={`font-bold text-left pl-4 ${highlight2 ? "text-blue-400" : "text-white"}`}
      >
        {val2}
      </span>
    </div>
  );
}

export default function TaleOfTape({ fighter1, fighter2 }: TaleOfTapeProps) {
  const s1 = fighter1.stats;
  const s2 = fighter2.stats;

  const hi = (a: number, b: number) => ({
    h1: a > b,
    h2: b > a,
  });

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="bg-black px-6 py-3 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-red-600" />
        <span className="text-white text-xs font-black uppercase tracking-[0.3em]">
          Tale of the Tape
        </span>
        <div className="h-px flex-1 bg-red-600" />
      </div>

      {/* Fighter images + names */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="grid grid-cols-3">
          {/* Fighter 1 image */}
          <FighterImage fighter={fighter1} side="left" />

          {/* Center: weight class */}
          <div className="flex flex-col items-center justify-end pb-4">
            <div className="text-gray-600 font-black text-sm uppercase tracking-widest">
              {fighter1.stats.weight}
            </div>
            <div className="text-gray-700 font-black text-xl mt-1">VS</div>
          </div>

          {/* Fighter 2 image */}
          <FighterImage fighter={fighter2} side="right" />
        </div>

        {/* Names below images */}
        <div className="grid grid-cols-3 px-4 pb-4">
          <div className="text-left">
            {fighter1.ranking && (
              <div className="text-red-500 text-xs font-bold mb-0.5">
                #{fighter1.ranking} {fighter1.stats.country}
              </div>
            )}
            <div className="text-white font-black text-base leading-tight">
              {fighter1.firstName}
            </div>
            <div className="text-red-500 font-black text-xl leading-tight uppercase">
              {fighter1.lastName}
            </div>
            <div className="text-gray-500 text-xs mt-0.5">
              {fighter1.nationality} {!fighter1.ranking && fighter1.stats.country}
            </div>
            {fighter1.nickname && (
              <div className="text-gray-600 text-xs">
                &ldquo;{fighter1.nickname}&rdquo;
              </div>
            )}
          </div>

          <div />

          <div className="text-right">
            {fighter2.ranking && (
              <div className="text-blue-500 text-xs font-bold mb-0.5">
                #{fighter2.ranking} {fighter2.stats.country}
              </div>
            )}
            <div className="text-white font-black text-base leading-tight">
              {fighter2.firstName}
            </div>
            <div className="text-blue-400 font-black text-xl leading-tight uppercase">
              {fighter2.lastName}
            </div>
            <div className="text-gray-500 text-xs mt-0.5">
              {fighter2.nationality} {!fighter2.ranking && fighter2.stats.country}
            </div>
            {fighter2.nickname && (
              <div className="text-gray-600 text-xs">
                &ldquo;{fighter2.nickname}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats table */}
      <div className="px-6 py-2">
        <StatRow
          label="Record"
          val1={`${s1.wins}-${s1.losses}-${s1.draws}`}
          val2={`${s2.wins}-${s2.losses}-${s2.draws}`}
          {...hi(s1.wins, s2.wins)}
        />
        <StatRow label="Age" val1={s1.age} val2={s2.age} />
        <StatRow label="Height" val1={s1.height} val2={s2.height} />
        <StatRow label="Weight" val1={s1.weight} val2={s2.weight} />
        <StatRow label="Reach" val1={s1.reach} val2={s2.reach}
          highlight1={parseInt(s1.reach) > parseInt(s2.reach)}
          highlight2={parseInt(s2.reach) > parseInt(s1.reach)}
        />
        <StatRow label="Stance" val1={s1.stance} val2={s2.stance} />
        <StatRow label="Gym" val1={s1.gym} val2={s2.gym} />
        <StatRow
          label="Str. Landed/min"
          val1={s1.sigStrikesLanded}
          val2={s2.sigStrikesLanded}
          {...hi(s1.sigStrikesLanded, s2.sigStrikesLanded)}
        />
        <StatRow
          label="Str. Absorbed/min"
          val1={s1.sigStrikesAbsorbed}
          val2={s2.sigStrikesAbsorbed}
          // lower is better
          highlight1={s1.sigStrikesAbsorbed < s2.sigStrikesAbsorbed}
          highlight2={s2.sigStrikesAbsorbed < s1.sigStrikesAbsorbed}
        />
        <StatRow
          label="Strike Accuracy"
          val1={`${s1.sigStrikeAccuracy}%`}
          val2={`${s2.sigStrikeAccuracy}%`}
          {...hi(s1.sigStrikeAccuracy, s2.sigStrikeAccuracy)}
        />
        <StatRow
          label="Strike Defense"
          val1={`${s1.sigStrikeDefense}%`}
          val2={`${s2.sigStrikeDefense}%`}
          {...hi(s1.sigStrikeDefense, s2.sigStrikeDefense)}
        />
        <StatRow
          label="TD Avg/15min"
          val1={s1.takedownAvg}
          val2={s2.takedownAvg}
          {...hi(s1.takedownAvg, s2.takedownAvg)}
        />
        <StatRow
          label="TD Accuracy"
          val1={`${s1.takedownAccuracy}%`}
          val2={`${s2.takedownAccuracy}%`}
          {...hi(s1.takedownAccuracy, s2.takedownAccuracy)}
        />
        <StatRow
          label="TD Defense"
          val1={`${s1.takedownDefense}%`}
          val2={`${s2.takedownDefense}%`}
          {...hi(s1.takedownDefense, s2.takedownDefense)}
        />
        <StatRow
          label="Sub Avg/15min"
          val1={s1.submissionAvg}
          val2={s2.submissionAvg}
          {...hi(s1.submissionAvg, s2.submissionAvg)}
        />
        <StatRow
          label="Finish Rate"
          val1={`${s1.finishRate}%`}
          val2={`${s2.finishRate}%`}
          {...hi(s1.finishRate, s2.finishRate)}
        />
      </div>
    </div>
  );
}
