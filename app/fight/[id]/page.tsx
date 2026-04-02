import { EVENTS } from "@/data/events";
import { FIGHTERS } from "@/data/fighters";
import TaleOfTape from "@/components/TaleOfTape";
import StatsComparison from "@/components/StatsComparison";
import FightHistory from "@/components/FightHistory";
import BettingOdds from "@/components/BettingOdds";
import FightHero from "@/components/FightHero";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FightPage({ params }: Props) {
  const { id } = await params;

  let fight = null;
  let event = null;

  for (const ev of EVENTS) {
    const f = ev.fights.find((f) => f.id === id);
    if (f) { fight = f; event = ev; break; }
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
      {/* Sticky nav */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Events
          </Link>
          <div className="h-4 w-px bg-gray-800" />
          <span className="text-gray-500 text-sm truncate">{event.name}</span>
          <span className="text-gray-700 text-sm hidden sm:block">·</span>
          <span className="text-gray-500 text-sm hidden sm:block">{event.date}</span>
        </div>
      </div>

      {/* Scroll-fade hero with fighter faces */}
      <FightHero
        fighter1={fighter1}
        fighter2={fighter2}
        weightClass={fight.weightClass}
        isMainEvent={fight.isMainEvent}
        isCoMainEvent={fight.isCoMainEvent}
        isTitleFight={fight.isTitleFight}
        titleType={fight.titleType}
        eventDate={event.date}
        eventVenue={event.venue}
      />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {fight.odds && (
          <BettingOdds fighter1={fighter1} fighter2={fighter2} odds={fight.odds} />
        )}
        <StatsComparison fighter1={fighter1} fighter2={fighter2} />
        <TaleOfTape fighter1={fighter1} fighter2={fighter2} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FightHistory fighter={fighter1} side="left" />
          <FightHistory fighter={fighter2} side="right" />
        </div>
      </div>
    </main>
  );
}
