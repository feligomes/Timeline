import * as React from "react"
import { format } from "date-fns"
import { EVENT_COLORS } from "@/lib/constants"
import { EventDialog } from "@/components/event-dialog"
import type { Event } from "@/types/calendar"
import type { EventColor } from "@/lib/constants"

interface DayViewProps {
  daysToDisplay: Date[]
  currentDate: Date
  onEventDrop: (eventId: string, originalDate: Date, newDate: Date) => void
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void
  onEventDelete: (eventId: string) => void
  onAddEvent: (event: { title: string; start: string; end: string; color: EventColor }) => void
  getEventsForDay: (day: Date) => Event[]
}

export function DayView({
  currentDate,
  onEventUpdate,
  onEventDelete,
  onAddEvent,
  getEventsForDay
}: DayViewProps) {
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <>
      <div className="flex flex-col" style={{ width: '700px', height: '550px' }}>
        <div className="flex border bg-background h-full">
          <div className="w-[100px] p-4 border-r">
            <div className="font-semibold">{format(currentDate, 'EEE')}</div>
            <div className="text-2xl">{format(currentDate, 'd')}</div>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {getEventsForDay(currentDate).map(event => {
              const colorObj = EVENT_COLORS.find(c => c.id === event.color)
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg text-white shadow-sm cursor-pointer hover:opacity-90`}
                  style={{ backgroundColor: colorObj?.value }}
                  title={event.title}
                  onClick={() => {
                    setSelectedEvent(event)
                    setIsDialogOpen(true)
                  }}
                >
                  <div className="text-sm font-medium">{event.title}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {format(new Date(event.start), 'MMM d')} - {format(new Date(event.end), 'MMM d')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventDialog
          mode="edit"
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          event={selectedEvent}
          onEventUpdate={onEventUpdate}
          onEventDelete={onEventDelete}
          onAddEvent={onAddEvent}
        />
      )}
    </>
  )
} 