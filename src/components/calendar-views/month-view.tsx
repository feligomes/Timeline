import * as React from "react"
import { format } from "date-fns"
import { DroppableDay } from "./droppable-day"
import { DraggableEvent } from "./draggable-event"
import type { Event } from "@/types/calendar"
import type { EventColor } from "@/lib/constants"

interface MonthViewProps {
  daysToDisplay: Date[]
  currentDate: Date
  onEventDrop: (eventId: string, originalDate: Date, newDate: Date) => void
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void
  onEventDelete: (eventId: string) => void
  onAddEvent: (event: { title: string; start: string; end: string; color: EventColor }) => void
  getEventsForDay: (day: Date) => Event[]
}

export function MonthView({
  daysToDisplay,
  currentDate,
  onEventDrop,
  onEventUpdate,
  onEventDelete,
  onAddEvent,
  getEventsForDay
}: MonthViewProps) {
  return (
    <div className="grid grid-cols-7 gap-1" style={{ width: '700px' }}>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div key={day} className="text-center font-semibold p-2" style={{ width: "100px" }}>
          {day}
        </div>
      ))}
      {daysToDisplay.map(day => (
        <DroppableDay 
          key={format(day, 'yyyy-MM-dd')} 
          day={day}
          currentDate={currentDate}
          onEventDrop={onEventDrop}
        >
          <div className="text-sm font-medium">{format(day, 'd')}</div>
          <div className="mt-1 space-y-1 overflow-y-auto">
            {getEventsForDay(day).map(event => (
              <DraggableEvent 
                key={event.id} 
                event={event} 
                day={day}
                onEventUpdate={onEventUpdate}
                onEventDelete={onEventDelete}
                onAddEvent={onAddEvent}
              />
            ))}
          </div>
        </DroppableDay>
      ))}
    </div>
  )
} 