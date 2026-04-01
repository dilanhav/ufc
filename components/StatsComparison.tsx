"use client";

import { Fighter } from "@/data/fighters";
import AdvantageBar from "./AdvantageBar";

interface StatsComparisonProps {
  fighter1: Fighter;
  fighter2: Fighter;
}

export default function StatsComparison({
  fighter1,
  fighter2,
}: StatsComparisonProps) {
  const s1 = fighter1.stats;
  const s2 = fighter2.stats;

  const categories = [
    {
      label: "Boxing",
      icon: "🥊",
      val1: s1.boxing,
      val2: s2.boxing,
    },
    {
      label: "Kickboxing",
      icon: "🦵",
      val1: s1.kickboxing,
      val2: s2.kickboxing,
    },
    {
      label: "Grappling",
      icon: "🤼",
      val1: s1.grappling,
      val2: s2.grappling,
    },
    {
      label: "BJJ",
      icon: "🥋",
      val1: s1.bjj,
      val2: s2.bjj,
    },
    {
      label: "Durability",
      icon: "🛡️",
      val1: s1.durability,
      val2: s2.durability,
    },
  ];

  // Win rate comparison
  const wr1 = s1.winRate;
  const wr2 = s2.winRate;

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="bg-black px-6 py-3 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-red-600" />
        <span className="text-white text-xs font-black uppercase tracking-[0.3em]">
          AI Skill Analysis
        </span>
        <div className="h-px flex-1 bg-red-600" />
      </div>

      {/* Fighter color legend */}
      <div className="flex justify-between px-6 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-white font-bold">
            {fighter1.firstName} {fighter1.lastName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white font-bold">
            {fighter2.firstName} {fighter2.lastName}
          </span>
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        </div>
      </div>

      <div className="px-6 pt-2 pb-4">
        {categories.map((cat) => (
          <AdvantageBar
            key={cat.label}
            label={cat.label}
            icon={cat.icon}
            val1={cat.val1}
            val2={cat.val2}
            name1={fighter1.lastName}
            name2={fighter2.lastName}
          />
        ))}

        {/* Win Rate */}
        <div className="mt-2 pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div className="text-center">
              <div className="text-3xl font-black text-white">
                {wr1.toFixed(1)}
                <span className="text-lg text-gray-500">%</span>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                Win Rate
              </div>
              <div className="text-xs text-gray-500">
                {s1.wins}W {s1.losses}L
              </div>
            </div>

            <div className="text-gray-600 font-black text-xl">WIN RATE</div>

            <div className="text-center">
              <div className="text-3xl font-black text-white">
                {wr2.toFixed(1)}
                <span className="text-lg text-gray-500">%</span>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                Win Rate
              </div>
              <div className="text-xs text-gray-500">
                {s2.wins}W {s2.losses}L
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
