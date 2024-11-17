
import * as React from "react"
import { format } from "date-fns"
import { DroppableDay } from "./droppable-day"
import { DraggableEvent } from "./draggable-event"
import type { Event } from "@/types/calendar"

interface MonthViewProps {
  daysToDisplay: Date[]
  currentDate: Date
  events: Event[]
  onEventDrop: (eventId: string, originalDate: Date, newDate: Date) => void
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void
  onEventDelete: (eventId: string) => void
  getEventsForDay: (day: Date) => Event[]
}

export function MonthView({
  daysToDisplay,
  currentDate,
  onEventDrop,
  onEventUpdate,
  onEventDelete,
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
          key={day.toString()} 
          day={day} 
          onEventDrop={onEventDrop}
          currentDate={currentDate}
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
              />
            ))}
          </div>
        </DroppableDay>
      ))}
    </div>
  )
} 