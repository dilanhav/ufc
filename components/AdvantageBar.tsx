"use client";

interface AdvantageBarProps {
  label: string;
  val1: number; // 0-10
  val2: number; // 0-10
  name1: string;
  name2: string;
  icon: string;
}

export default function AdvantageBar({
  label,
  val1,
  val2,
  name1,
  name2,
  icon,
}: AdvantageBarProps) {
  const total = val1 + val2 || 1;
  const pct1 = (val1 / total) * 100;
  const pct2 = (val2 / total) * 100;

  const winner =
    val1 > val2 ? "left" : val2 > val1 ? "right" : "tie";

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-sm font-bold ${winner === "left" ? "text-red-400" : "text-gray-400"}`}
        >
          {val1.toFixed(1)}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-base">{icon}</span>
          <span className="text-xs font-black uppercase tracking-widest text-gray-300">
            {label}
          </span>
        </div>
        <span
          className={`text-sm font-bold ${winner === "right" ? "text-blue-400" : "text-gray-400"}`}
        >
          {val2.toFixed(1)}
        </span>
      </div>

      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-900">
        <div
          className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-700"
          style={{ width: `${pct1}%` }}
        />
        <div
          className="h-full bg-gradient-to-l from-blue-700 to-blue-500 transition-all duration-700"
          style={{ width: `${pct2}%` }}
        />
      </div>

      {/* Winner label */}
      {winner !== "tie" && (
        <div
          className={`text-xs mt-1 font-semibold ${winner === "left" ? "text-red-400 text-left" : "text-blue-400 text-right"}`}
        >
          {winner === "left" ? `${name1} advantage` : `${name2} advantage`}
        </div>
      )}
    </div>
  );
}
