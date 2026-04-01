"use client";

import { Fighter } from "@/data/fighters";

interface TaleOfTapeProps {
  fighter1: Fighter;
  fighter2: Fighter;
}

function StatRow({
  label,
  val1,
  val2,
}: {
  label: string;
  val1: string | number;
  val2: string | number;
}) {
  return (
    <div className="grid grid-cols-3 items-center py-2 border-b border-gray-800 text-sm">
      <span className="text-white font-bold text-right pr-4">{val1}</span>
      <span className="text-gray-400 text-center text-xs uppercase tracking-widest font-medium">
        {label}
      </span>
      <span className="text-white font-bold text-left pl-4">{val2}</span>
    </div>
  );
}

export default function TaleOfTape({ fighter1, fighter2 }: TaleOfTapeProps) {
  const s1 = fighter1.stats;
  const s2 = fighter2.stats;

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

      {/* Fighter names row */}
      <div className="grid grid-cols-3 bg-gray-900 px-6 py-4">
        <div className="text-left">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            {fighter1.nationality}{" "}
            {fighter1.ranking ? `#${fighter1.ranking}` : ""}
          </div>
          <div className="text-white font-black text-lg leading-tight">
            {fighter1.firstName}
          </div>
          <div className="text-red-500 font-black text-xl leading-tight uppercase">
            {fighter1.lastName}
          </div>
          {fighter1.nickname && (
            <div className="text-gray-500 text-xs mt-1">
              &ldquo;{fighter1.nickname}&rdquo;
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <span className="text-gray-600 font-black text-2xl">VS</span>
        </div>

        <div className="text-right">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            {fighter2.nationality}{" "}
            {fighter2.ranking ? `#${fighter2.ranking}` : ""}
          </div>
          <div className="text-white font-black text-lg leading-tight">
            {fighter2.firstName}
          </div>
          <div className="text-red-500 font-black text-xl leading-tight uppercase">
            {fighter2.lastName}
          </div>
          {fighter2.nickname && (
            <div className="text-gray-500 text-xs mt-1">
              &ldquo;{fighter2.nickname}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-2">
        <StatRow
          label="Record"
          val1={`${s1.wins}-${s1.losses}-${s1.draws}`}
          val2={`${s2.wins}-${s2.losses}-${s2.draws}`}
        />
        <StatRow label="Age" val1={s1.age} val2={s2.age} />
        <StatRow label="Height" val1={s1.height} val2={s2.height} />
        <StatRow label="Weight" val1={s1.weight} val2={s2.weight} />
        <StatRow label="Reach" val1={s1.reach} val2={s2.reach} />
        <StatRow label="Stance" val1={s1.stance} val2={s2.stance} />
        <StatRow label="Gym" val1={s1.gym} val2={s2.gym} />
        <StatRow
          label="Str. Landed/min"
          val1={s1.sigStrikesLanded}
          val2={s2.sigStrikesLanded}
        />
        <StatRow
          label="Str. Absorbed/min"
          val1={s1.sigStrikesAbsorbed}
          val2={s2.sigStrikesAbsorbed}
        />
        <StatRow
          label="Strike Accuracy"
          val1={`${s1.sigStrikeAccuracy}%`}
          val2={`${s2.sigStrikeAccuracy}%`}
        />
        <StatRow
          label="Strike Defense"
          val1={`${s1.sigStrikeDefense}%`}
          val2={`${s2.sigStrikeDefense}%`}
        />
        <StatRow
          label="TD Avg/15min"
          val1={s1.takedownAvg}
          val2={s2.takedownAvg}
        />
        <StatRow
          label="TD Accuracy"
          val1={`${s1.takedownAccuracy}%`}
          val2={`${s2.takedownAccuracy}%`}
        />
        <StatRow
          label="TD Defense"
          val1={`${s1.takedownDefense}%`}
          val2={`${s2.takedownDefense}%`}
        />
        <StatRow
          label="Sub Avg/15min"
          val1={s1.submissionAvg}
          val2={s2.submissionAvg}
        />
        <StatRow
          label="Avg Fight Time"
          val1={s1.avgFightTime}
          val2={s2.avgFightTime}
        />
      </div>
    </div>
  );
}
