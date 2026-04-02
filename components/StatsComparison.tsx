"use client";

import { Fighter, computeSkillScores, computeWinProbability } from "@/data/fighters";
import AdvantageBar from "./AdvantageBar";

interface StatsComparisonProps {
  fighter1: Fighter;
  fighter2: Fighter;
}

export default function StatsComparison({ fighter1, fighter2 }: StatsComparisonProps) {
  const s1 = computeSkillScores(fighter1);
  const s2 = computeSkillScores(fighter2);
  const { prob1, prob2 } = computeWinProbability(fighter1, fighter2);

  const f1 = fighter1.stats;
  const f2 = fighter2.stats;

  const categories = [
    {
      label: "Boxing",
      icon: "🥊",
      val1: s1.boxing,
      val2: s2.boxing,
      sub1: `${f1.koTkoWins} KO/TKO wins`,
      sub2: `${f2.koTkoWins} KO/TKO wins`,
    },
    {
      label: "Kickboxing",
      icon: "🦵",
      val1: s1.kickboxing,
      val2: s2.kickboxing,
      sub1: `${f1.sigStrikesLanded} SLpM`,
      sub2: `${f2.sigStrikesLanded} SLpM`,
    },
    {
      label: "Grappling",
      icon: "🤼",
      val1: s1.grappling,
      val2: s2.grappling,
      sub1: `${f1.takedownAvg} TD/15min`,
      sub2: `${f2.takedownAvg} TD/15min`,
    },
    {
      label: "BJJ",
      icon: "🥋",
      val1: s1.bjj,
      val2: s2.bjj,
      sub1: `${f1.submissionWins} sub wins`,
      sub2: `${f2.submissionWins} sub wins`,
    },
    {
      label: "Durability",
      icon: "🛡️",
      val1: s1.durability,
      val2: s2.durability,
      sub1: `${f1.ufcKoLosses} UFC KO losses`,
      sub2: `${f2.ufcKoLosses} UFC KO losses`,
    },
    {
      label: "Stand-up Defense",
      icon: "🪃",
      val1: s1.standUpDefense,
      val2: s2.standUpDefense,
      sub1: `${f1.sigStrikesAbsorbed} SApM`,
      sub2: `${f2.sigStrikesAbsorbed} SApM`,
    },
  ];

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

      {/* Legend */}
      <div className="flex justify-between px-6 pt-4 pb-1">
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
          <div key={cat.label} className="mb-1">
            <div className="flex justify-between text-xs text-gray-600 mb-0.5 px-0.5">
              <span>{cat.sub1}</span>
              <span>{cat.sub2}</span>
            </div>
            <AdvantageBar
              label={cat.label}
              icon={cat.icon}
              val1={cat.val1}
              val2={cat.val2}
              name1={fighter1.lastName}
              name2={fighter2.lastName}
            />
          </div>
        ))}

        {/* Win Probability */}
        <div className="mt-2 pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 uppercase tracking-widest text-center mb-3 font-bold">
            AI Win Probability · Weighted by Recent Form
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-center">
              <div className="text-4xl font-black text-red-400">
                {prob1}
                <span className="text-xl text-gray-500">%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{fighter1.lastName}</div>
            </div>
            <div className="text-gray-700 font-black text-sm">vs</div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-400">
                {prob2}
                <span className="text-xl text-gray-500">%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{fighter2.lastName}</div>
            </div>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-900">
            <div className="h-full bg-gradient-to-r from-red-700 to-red-500" style={{ width: `${prob1}%` }} />
            <div className="h-full bg-gradient-to-l from-blue-700 to-blue-500" style={{ width: `${prob2}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-600">{fighter1.stats.wins}W-{fighter1.stats.losses}L career</span>
            <span className="text-xs text-gray-600">{fighter2.stats.wins}W-{fighter2.stats.losses}L career</span>
          </div>
        </div>
      </div>
    </div>
  );
}
