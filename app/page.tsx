import { EVENTS } from "@/data/events";
import { FIGHTERS } from "@/data/fighters";
import Link from "next/link";

function FightCard({
  fight,
}: {
  fight: (typeof EVENTS)[0]["fights"][0];
}) {
  const f1 = FIGHTERS[fight.fighter1Id];
  const f2 = FIGHTERS[fight.fighter2Id];

  if (!f1 || !f2) return null;

  return (
    <Link href={`/fight/${fight.id}`}>
      <div className="group bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all duration-200 cursor-pointer">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {fight.isMainEvent && (
            <span className="bg-red-600 text-white text-xs font-black uppercase px-2 py-0.5 rounded">
              Main Event
            </span>
          )}
          {fight.isCoMainEvent && (
            <span className="bg-orange-600 text-white text-xs font-black uppercase px-2 py-0.5 rounded">
              Co-Main
            </span>
          )}
          {fight.isTitleFight && (
            <span className="bg-yellow-600 text-black text-xs font-black uppercase px-2 py-0.5 rounded">
              Title
            </span>
          )}
          <span className="text-gray-500 text-xs uppercase tracking-wide">
            {fight.weightClass}
          </span>
        </div>

        {/* Fighters */}
        <div className="grid grid-cols-3 items-center">
          <div className="text-left">
            {f1.ranking && (
              <div className="text-red-500 text-xs font-bold mb-0.5">
                #{f1.ranking}
              </div>
            )}
            <div className="text-white font-black text-sm leading-tight">
              {f1.firstName}
            </div>
            <div className="text-white font-black text-base leading-tight uppercase">
              {f1.lastName}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {f1.nationality} {f1.stats.wins}-{f1.stats.losses}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">vs</span>
          </div>

          <div className="text-right">
            {f2.ranking && (
              <div className="text-blue-500 text-xs font-bold mb-0.5">
                #{f2.ranking}
              </div>
            )}
            <div className="text-white font-black text-sm leading-tight">
              {f2.firstName}
            </div>
            <div className="text-white font-black text-base leading-tight uppercase">
              {f2.lastName}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {f2.nationality} {f2.stats.wins}-{f2.stats.losses}
            </div>
          </div>
        </div>

        {/* View analysis CTA */}
        <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
          <span className="text-gray-500 text-xs">AI Analysis available</span>
          <span className="text-red-500 text-xs font-bold group-hover:text-red-400 transition-colors">
            View Breakdown →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 px-3 py-1.5 rounded">
              <span className="text-white font-black text-xl tracking-wider">
                UFC
              </span>
            </div>
            <div>
              <div className="text-white font-black text-lg">Fight Analyzer</div>
              <div className="text-gray-500 text-xs">AI-powered breakdowns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {EVENTS.map((event) => (
          <div key={event.id}>
            {/* Event header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-red-600 text-white text-xs font-black uppercase px-2 py-0.5 rounded">
                    {event.shortName}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">
                    {event.date}
                  </span>
                </div>
                <div className="text-white font-black text-xl">{event.name}</div>
                <div className="text-gray-500 text-sm">
                  {event.venue} · {event.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-xs">{event.broadcast}</div>
              </div>
            </div>

            {/* Fights */}
            {event.fights.length > 0 ? (
              <div className="space-y-3">
                {event.fights.map((fight) => (
                  <FightCard key={fight.id} fight={fight} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <div className="text-gray-500 text-sm">
                  Fight card to be announced
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
