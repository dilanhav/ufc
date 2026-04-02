import { FIGHTERS, computeSkillScores, computeRecentFormScore } from "@/data/fighters";
import FighterImage from "@/components/FighterImage";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/[0.04] rounded-xl p-4">
      <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</div>
      <div className="text-white font-black text-xl">{value}</div>
      {sub && <div className="text-gray-600 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function SkillBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100;
  const color =
    value >= 8 ? "bg-green-500" :
    value >= 6 ? "bg-yellow-500" :
    value >= 4 ? "bg-orange-500" : "bg-red-600";

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-400 text-xs uppercase tracking-wide">{label}</span>
        <span className="text-white text-sm font-bold">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function FighterPage({ params }: Props) {
  const { id } = await params;
  const fighter = FIGHTERS[id];
  if (!fighter) notFound();

  const s = fighter.stats;
  const skills = computeSkillScores(fighter);
  const recentForm = computeRecentFormScore(s.lastFights);
  const totalFights = s.wins + s.losses + s.draws;
  const winRate = totalFights > 0 ? ((s.wins / totalFights) * 100).toFixed(1) : "0";

  const favTotal = s.winsAsFavorite + s.lossesAsFavorite;
  const undTotal = s.winsAsUnderdog + s.lossesAsUnderdog;

  const methodWins = [
    { label: "KO / TKO", count: s.koTkoWins, color: "bg-red-600" },
    { label: "Submission", count: s.submissionWins, color: "bg-purple-600" },
    { label: "Decision", count: s.wins - s.koTkoWins - s.submissionWins, color: "bg-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Events</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900/60 to-transparent">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
          <div className="flex items-end gap-8">
            <FighterImage fighter={fighter} side="left" height={200} />
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                {fighter.ranking && (
                  <span className="bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold px-2 py-0.5 rounded">
                    #{fighter.ranking} {fighter.weightClass}
                  </span>
                )}
                <span className="text-gray-500 text-sm">{fighter.nationality} {s.country}</span>
              </div>
              <h1 className="text-white font-black text-4xl md:text-5xl uppercase leading-none tracking-tight">
                {fighter.firstName} {fighter.lastName}
              </h1>
              {fighter.nickname && (
                <div className="text-gray-500 text-base mt-1">&ldquo;{fighter.nickname}&rdquo;</div>
              )}
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <span className="text-green-400 font-black text-2xl">{s.wins}</span>
                  <span className="text-gray-600 text-sm ml-1">W</span>
                  <span className="text-red-500 font-black text-2xl ml-3">{s.losses}</span>
                  <span className="text-gray-600 text-sm ml-1">L</span>
                  {s.draws > 0 && (
                    <>
                      <span className="text-gray-400 font-black text-2xl ml-3">{s.draws}</span>
                      <span className="text-gray-600 text-sm ml-1">D</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-gray-500 text-sm mt-1">{s.gym} · {s.stance}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Win Rate" value={`${winRate}%`} sub={`${totalFights} fights`} />
          <StatBox label="Finish Rate" value={`${Math.round(((s.koTkoWins + s.submissionWins) / Math.max(s.wins, 1)) * 100)}%`} sub="of wins by finish" />
          <StatBox label="Recent Form" value={`${Math.round(recentForm * 100)}%`} sub="last 5 weighted" />
          <StatBox label="Height / Reach" value={`${s.height}`} sub={`${s.reach} reach`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left col */}
          <div className="space-y-6">
            {/* Physical */}
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Fighter Profile</h3>
              <div className="space-y-2.5">
                {[
                  ["Age", s.age],
                  ["Height", s.height],
                  ["Weight", s.weight],
                  ["Reach", s.reach],
                  ["Stance", s.stance],
                  ["Gym", s.gym],
                  ["Country", s.country],
                ].map(([label, val]) => (
                  <div key={String(label)} className="flex justify-between items-center text-sm border-b border-white/[0.04] pb-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Win breakdown by method */}
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Win Breakdown</h3>
              <div className="space-y-3">
                {methodWins.map(({ label, count, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full`}
                        style={{ width: `${(count / Math.max(s.wins, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Betting record */}
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Betting Record</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-xs mb-2 uppercase tracking-wide">As Favorite</div>
                  <div className="text-2xl font-black">
                    <span className="text-green-400">{s.winsAsFavorite}</span>
                    <span className="text-gray-700">-</span>
                    <span className="text-red-500">{s.lossesAsFavorite}</span>
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    {favTotal > 0 ? `${Math.round((s.winsAsFavorite / favTotal) * 100)}% win rate` : "No data"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-2 uppercase tracking-wide">As Underdog</div>
                  <div className="text-2xl font-black">
                    <span className="text-green-400">{s.winsAsUnderdog}</span>
                    <span className="text-gray-700">-</span>
                    <span className="text-red-500">{s.lossesAsUnderdog}</span>
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    {undTotal > 0 ? `${Math.round((s.winsAsUnderdog / undTotal) * 100)}% win rate` : "No data"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-6">
            {/* AI Skills */}
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">AI Skill Ratings</h3>
              <SkillBar label="Boxing" value={skills.boxing} />
              <SkillBar label="Kickboxing" value={skills.kickboxing} />
              <SkillBar label="Grappling" value={skills.grappling} />
              <SkillBar label="BJJ / Submissions" value={skills.bjj} />
              <SkillBar label="Durability" value={skills.durability} />
              <SkillBar label="Stand-up Defense" value={skills.standUpDefense} />
            </div>

            {/* Career stats */}
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Career Stats</h3>
              <div className="space-y-2.5">
                {[
                  ["Str. Landed/min", s.sigStrikesLanded],
                  ["Str. Absorbed/min", s.sigStrikesAbsorbed],
                  ["Strike Accuracy", `${s.sigStrikeAccuracy}%`],
                  ["Strike Defense", `${s.sigStrikeDefense}%`],
                  ["TD Avg / 15 min", s.takedownAvg],
                  ["TD Accuracy", `${s.takedownAccuracy}%`],
                  ["TD Defense", `${s.takedownDefense}%`],
                  ["Sub Avg / 15 min", s.submissionAvg],
                  ["Knockdowns Landed", `${s.knockdownAvg}/15min`],
                  ["KD Absorbed (UFC)", s.knockdownsAbsorbed],
                  ["UFC KO Losses", s.ufcKoLosses],
                ].map(([label, val]) => (
                  <div key={String(label)} className="flex justify-between items-center text-sm border-b border-white/[0.04] pb-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Last 5 fights */}
        <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Fight History</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {s.lastFights.slice(0, 5).map((fight, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  fight.result === "W" ? "bg-green-700 text-white" :
                  fight.result === "L" ? "bg-red-800 text-white" :
                  "bg-gray-700 text-white"
                }`}>
                  {fight.result}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{fight.opponent}</div>
                  <div className="text-gray-600 text-xs mt-0.5 truncate">{fight.event}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-gray-400 text-xs font-medium">{fight.method}</div>
                  <div className="text-gray-600 text-xs">R{fight.round} · {fight.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
