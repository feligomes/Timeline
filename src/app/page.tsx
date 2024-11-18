import EventCalendar from "@/components/event-calendar";
import { MOCK_EVENTS } from "@/lib/mock-data";

export default function CalendarPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <EventCalendar initialEvents={MOCK_EVENTS} />
      </main>
    </div>
  );
}
