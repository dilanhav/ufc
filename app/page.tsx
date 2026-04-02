import { EVENTS } from "@/data/events";
import EventCard from "@/components/EventCard";

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
        {EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </main>
    </div>
  );
}
