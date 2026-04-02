import { EVENTS } from "@/data/events";
import { FIGHTERS } from "@/data/fighters";
import FightRow from "@/components/FightRow";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 px-2.5 py-1 rounded text-white font-black text-lg tracking-wider">
              UFC
            </div>
            <div>
              <div className="text-white font-bold text-base leading-none">Fight Analyzer</div>
              <div className="text-gray-600 text-xs mt-0.5">AI · Odds · Stats</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {EVENTS.map((event) => {
          const mainCard = event.fights.filter((f) => f.isMainCard);
          const prelims = event.fights.filter((f) => !f.isMainCard);

          return (
            <section key={event.id}>
              {/* Event header */}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                      {event.shortName}
                    </span>
                    <span className="text-gray-500 text-sm">{event.date}</span>
                  </div>
                  <h2 className="text-white font-black text-2xl leading-tight">{event.name}</h2>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {event.venue} · {event.location}
                  </p>
                </div>
                <span className="text-gray-600 text-xs">{event.broadcast}</span>
              </div>

              {event.fights.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-8 text-center text-gray-600 text-sm">
                  Card to be announced
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  {mainCard.length > 0 && (
                    <>
                      <div className="px-5 py-2 bg-white/[0.03] flex items-center gap-2 border-b border-white/5">
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Main Card</span>
                        <span className="text-gray-700 text-[10px]">·</span>
                        <span className="text-gray-600 text-[10px]">{event.broadcast}</span>
                      </div>
                      {mainCard.map((f) => {
                        const f1 = FIGHTERS[f.fighter1Id];
                        const f2 = FIGHTERS[f.fighter2Id];
                        if (!f1 || !f2) return null;
                        return <FightRow key={f.id} fight={f} fighter1={f1} fighter2={f2} />;
                      })}
                    </>
                  )}
                  {prelims.length > 0 && (
                    <>
                      <div className="px-5 py-2 bg-white/[0.02] flex items-center gap-2 border-b border-white/5 border-t border-white/5">
                        <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">Prelims</span>
                      </div>
                      {prelims.map((f) => {
                        const f1 = FIGHTERS[f.fighter1Id];
                        const f2 = FIGHTERS[f.fighter2Id];
                        if (!f1 || !f2) return null;
                        return <FightRow key={f.id} fight={f} fighter1={f1} fighter2={f2} />;
                      })}
                    </>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
