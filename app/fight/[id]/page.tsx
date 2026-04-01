import { EVENTS } from "@/data/events";
import { FIGHTERS } from "@/data/fighters";
import TaleOfTape from "@/components/TaleOfTape";
import StatsComparison from "@/components/StatsComparison";
import FightHistory from "@/components/FightHistory";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FightPage({ params }: Props) {
  const { id } = await params;

  // Find the fight across all events
  let fight = null;
  let event = null;

  for (const ev of EVENTS) {
    const f = ev.fights.find((f) => f.id === id);
    if (f) {
      fight = f;
      event = ev;
      break;
    }
  }

  if (!fight || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Fight not found</div>
      </div>
    );
  }

  const fighter1 = FIGHTERS[fight.fighter1Id];
  const fighter2 = FIGHTERS[fight.fighter2Id];

  if (!fighter1 || !fighter2) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Fighter data unavailable</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Top nav */}
      <div className="bg-black border-b border-gray-900 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Events
          </Link>
          <div className="h-4 w-px bg-gray-800" />
          <span className="text-gray-500 text-sm">{event.name}</span>
        </div>
      </div>

      {/* Fight banner */}
      <div className="bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-2">
            {fight.isTitleFight && (
              <span className="inline-block bg-yellow-600 text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {fight.titleType} Title Fight
              </span>
            )}
            <div className="text-red-600 text-xs font-black uppercase tracking-[0.3em] mb-1">
              {fight.weightClass} · {event.date}
            </div>
          </div>

          {/* Fighters hero */}
          <div className="grid grid-cols-3 items-center gap-4 mt-6">
            {/* Fighter 1 */}
            <div className="text-right">
              {fighter1.ranking && (
                <div className="text-red-500 text-sm font-bold mb-1">
                  #{fighter1.ranking} Ranked
                </div>
              )}
              <div className="text-white font-black text-2xl md:text-4xl leading-tight uppercase">
                {fighter1.firstName}
              </div>
              <div className="text-red-500 font-black text-3xl md:text-5xl leading-tight uppercase">
                {fighter1.lastName}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {fighter1.nationality} {fighter1.stats.country}
              </div>
              <div className="text-gray-500 text-xs mt-0.5">
                {fighter1.stats.wins}W · {fighter1.stats.losses}L
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center">
                <span className="text-gray-400 font-black text-xl">VS</span>
              </div>
            </div>

            {/* Fighter 2 */}
            <div className="text-left">
              {fighter2.ranking && (
                <div className="text-blue-500 text-sm font-bold mb-1">
                  #{fighter2.ranking} Ranked
                </div>
              )}
              <div className="text-white font-black text-2xl md:text-4xl leading-tight uppercase">
                {fighter2.firstName}
              </div>
              <div className="text-blue-400 font-black text-3xl md:text-5xl leading-tight uppercase">
                {fighter2.lastName}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {fighter2.nationality} {fighter2.stats.country}
              </div>
              <div className="text-gray-500 text-xs mt-0.5">
                {fighter2.stats.wins}W · {fighter2.stats.losses}L
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* AI Skill Analysis */}
        <StatsComparison fighter1={fighter1} fighter2={fighter2} />

        {/* Tale of the Tape */}
        <TaleOfTape fighter1={fighter1} fighter2={fighter2} />

        {/* Fight History — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FightHistory fighter={fighter1} side="left" />
          <FightHistory fighter={fighter2} side="right" />
        </div>
      </div>
    </main>
  );
}
