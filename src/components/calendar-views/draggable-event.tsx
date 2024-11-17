
import * as React from "react"
import { useDrag } from 'react-dnd'
import { EVENT_COLORS } from "@/lib/constants"
import { EventDialog } from "@/components/event-dialog"
import type { Event } from "@/types/calendar"

interface DragItem {
  eventId: string
  originalDate: Date
}

interface DraggableEventProps {
  event: Event
  day: Date
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void
  onEventDelete: (eventId: string) => void
}

export function DraggableEvent({ event, day, onEventUpdate, onEventDelete }: DraggableEventProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(() => ({
    type: 'EVENT',
    item: { eventId: event.id, originalDate: day },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [event.id, day])

  const colorObj = EVENT_COLORS.find(c => c.id === event.color)

  return (
    <>
      <div
        ref={drag}
        className={`text-xs p-1 rounded text-white truncate cursor-move ${
          isDragging ? 'opacity-50' : ''
        }`}
        style={{ backgroundColor: colorObj?.value }}
        title={event.title}
        onDoubleClick={() => setIsEditing(true)}
      >
        {event.title}
      </div>

      <EventDialog
        mode="edit"
        event={event}
        open={isEditing}
        onOpenChange={setIsEditing}
        onEventUpdate={onEventUpdate}
        onEventDelete={onEventDelete}
      />
    </>
  )
} 