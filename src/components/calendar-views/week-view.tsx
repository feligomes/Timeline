import * as React from "react"
import { format } from "date-fns"
import { DroppableDay } from "./droppable-day"
import { DraggableEvent } from "./draggable-event"
import type { Event } from "@/types/calendar"

interface WeekViewProps {
  daysToDisplay: Date[]
  currentDate: Date
  onEventDrop: (eventId: string, originalDate: Date, newDate: Date) => void
  getEventsForDay: (day: Date) => Event[]
}

export function WeekView({
  daysToDisplay,
  currentDate,
  onEventDrop,
  getEventsForDay
}: WeekViewProps) {
  return (
    <div className="flex flex-col gap-1" style={{ width: '700px' }}>
      {daysToDisplay.map(day => (
        <DroppableDay 
          key={format(day, 'yyyy-MM-dd')} 
          day={day}
          currentDate={currentDate}
          onEventDrop={onEventDrop}
        >
          <div className="flex w-full">
            <div className="w-[100px] p-4 border-r">
              <div className="font-semibold">{format(day, 'EEE')}</div>
              <div className="text-2xl">{format(day, 'd')}</div>
            </div>
            <div className="flex-1 p-2 space-y-1">
              {getEventsForDay(day).map(event => (
                <DraggableEvent 
                  key={event.id} 
                  event={event} 
                  day={day}
                />
              ))}
            </div>
          </div>
        </DroppableDay>
      ))}
    </div>
  )
} 