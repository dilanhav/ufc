"use client";

import { Fighter, computeWinProbability } from "@/data/fighters";
import { BettingOdds as OddsType } from "@/data/events";

interface Props {
  fighter1: Fighter;
  fighter2: Fighter;
  odds: OddsType;
}

function americanToImplied(american: number): number {
  if (american > 0) return 100 / (american + 100);
  return Math.abs(american) / (Math.abs(american) + 100);
}

function formatAmerican(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

function valueLabel(aiProb: number, impliedProb: number): { text: string; color: string } | null {
  const edge = aiProb - impliedProb;
  if (edge > 0.08) return { text: "Strong Value", color: "text-green-400" };
  if (edge > 0.03) return { text: "Value", color: "text-green-500" };
  if (edge < -0.08) return { text: "Overpriced", color: "text-red-400" };
  if (edge < -0.03) return { text: "Slight Fade", color: "text-orange-400" };
  return { text: "Fair Price", color: "text-gray-400" };
}

export default function BettingOdds({ fighter1, fighter2, odds }: Props) {
  const { prob1: aiProb1, prob2: aiProb2 } = computeWinProbability(fighter1, fighter2);

  // Remove the bookmaker's vig to get true implied probabilities
  const rawImpl1 = americanToImplied(odds.fighter1American);
  const rawImpl2 = americanToImplied(odds.fighter2American);
  const vigTotal = rawImpl1 + rawImpl2;
  const impliedProb1 = rawImpl1 / vigTotal;
  const impliedProb2 = rawImpl2 / vigTotal;

  const aiPct1 = aiProb1 / 100;
  const aiPct2 = aiProb2 / 100;

  const val1 = valueLabel(aiPct1, impliedProb1);
  const val2 = valueLabel(aiPct2, impliedProb2);

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="bg-black px-6 py-3 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-yellow-600" />
        <span className="text-white text-xs font-black uppercase tracking-[0.3em]">
          Betting Odds · {odds.sportsbook}
        </span>
        <div className="h-px flex-1 bg-yellow-600" />
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Fighter 1 */}
          <div className="text-left space-y-2">
            <div className="text-gray-400 text-xs font-semibold truncate">
              {fighter1.firstName} {fighter1.lastName}
            </div>
            <div className={`text-3xl font-black ${odds.fighter1American > 0 ? "text-green-400" : "text-red-400"}`}>
              {formatAmerican(odds.fighter1American)}
            </div>
            <div className="text-gray-500 text-xs">
              Implied: {Math.round(impliedProb1 * 100)}%
            </div>
            <div className="text-gray-500 text-xs">
              AI: <span className="text-white font-bold">{aiProb1}%</span>
            </div>
            {val1 && (
              <div className={`text-xs font-bold ${val1.color}`}>
                {val1.text}
              </div>
            )}
          </div>

          {/* Center divider */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-gray-700 text-xs uppercase tracking-widest font-bold">
              Moneyline
            </div>
            <div className="w-px h-16 bg-gray-800" />
            <div className="text-gray-600 text-xs">
              Vig: {Math.round((vigTotal - 1) * 100)}%
            </div>
          </div>

          {/* Fighter 2 */}
          <div className="text-right space-y-2">
            <div className="text-gray-400 text-xs font-semibold truncate">
              {fighter2.firstName} {fighter2.lastName}
            </div>
            <div className={`text-3xl font-black ${odds.fighter2American > 0 ? "text-green-400" : "text-red-400"}`}>
              {formatAmerican(odds.fighter2American)}
            </div>
            <div className="text-gray-500 text-xs">
              Implied: {Math.round(impliedProb2 * 100)}%
            </div>
            <div className="text-gray-500 text-xs">
              AI: <span className="text-white font-bold">{aiProb2}%</span>
            </div>
            {val2 && (
              <div className={`text-xs font-bold ${val2.color}`}>
                {val2.text}
              </div>
            )}
          </div>
        </div>

        {/* Value bar */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-600 mb-2 uppercase tracking-widest">AI vs. Market</div>
          <div className="space-y-2">
            {[
              { name: fighter1.lastName, ai: aiPct1, implied: impliedProb1, color: "bg-red-500" },
              { name: fighter2.lastName, ai: aiPct2, implied: impliedProb2, color: "bg-blue-500" },
            ].map(({ name, ai, implied, color }) => (
              <div key={name} className="flex items-center gap-3">
                <div className="text-xs text-gray-400 w-16 truncate">{name}</div>
                <div className="flex-1 relative h-4 bg-gray-900 rounded-full overflow-hidden">
                  {/* Market bar (light, behind) */}
                  <div
                    className="absolute top-0 left-0 h-full bg-gray-700 rounded-full"
                    style={{ width: `${implied * 100}%` }}
                  />
                  {/* AI bar (solid, in front) */}
                  <div
                    className={`absolute top-0 left-0 h-full ${color} opacity-80 rounded-full`}
                    style={{ width: `${ai * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 w-20 text-right">
                  <span className="text-white font-bold">{Math.round(ai * 100)}%</span>
                  {" "}vs {Math.round(implied * 100)}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-2 bg-red-500 opacity-80 rounded-sm" /> AI</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-2 bg-gray-700 rounded-sm" /> Market</span>
          </div>
        </div>
      </div>
    </div>
  );
}
