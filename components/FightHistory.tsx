"use client";

import { Fighter } from "@/data/fighters";

interface FightHistoryProps {
  fighter: Fighter;
  side: "left" | "right";
}

const METHOD_COLORS: Record<string, string> = {
  KO: "bg-red-600",
  TKO: "bg-orange-600",
  SUB: "bg-purple-600",
  DEC: "bg-blue-600",
  NC: "bg-gray-600",
};

function getMethodColor(method: string): string {
  const key = Object.keys(METHOD_COLORS).find((k) => method.startsWith(k));
  return key ? METHOD_COLORS[key] : "bg-gray-600";
}

function getMethodShort(method: string): string {
  if (method.startsWith("KO")) return "KO";
  if (method.startsWith("TKO")) return "TKO";
  if (method.startsWith("SUB")) return "SUB";
  if (method.startsWith("DEC")) return "DEC";
  return method;
}

export default function FightHistory({ fighter, side }: FightHistoryProps) {
  const fights = fighter.stats.lastFights.slice(0, 5);

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 h-full">
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center gap-2 ${
          side === "left"
            ? "bg-gradient-to-r from-red-900/60 to-gray-900"
            : "bg-gradient-to-l from-blue-900/60 to-gray-900"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${side === "left" ? "bg-red-500" : "bg-blue-500"}`}
        />
        <div>
          <div className="text-white font-black text-sm">
            {fighter.firstName} {fighter.lastName}
          </div>
          <div className="text-gray-400 text-xs">Last 5 Fights</div>
        </div>
      </div>

      {/* Fight list */}
      <div className="divide-y divide-gray-900">
        {fights.map((fight, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-3">
            {/* Result badge */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${
                fight.result === "W"
                  ? "bg-green-700 text-white"
                  : fight.result === "L"
                    ? "bg-red-800 text-white"
                    : "bg-gray-700 text-white"
              }`}
            >
              {fight.result}
            </div>

            {/* Fight info */}
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">
                {fight.opponent}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold ${getMethodColor(fight.method)} text-white`}
                >
                  {getMethodShort(fight.method)}
                </span>
                <span className="text-gray-500 text-xs">R{fight.round}</span>
                <span className="text-gray-600 text-xs truncate">
                  · {fight.event}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="text-gray-600 text-xs flex-shrink-0">
              {fight.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
