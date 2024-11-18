/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react"
import { useDrop } from 'react-dnd'
import { isSameMonth } from "date-fns"
import type { DragItem } from "@/types/calendar"

interface DroppableDayProps {
  day: Date
  children: React.ReactNode
  currentDate: Date
  onEventDrop: (eventId: string, originalDate: Date, newDate: Date) => void
}

export function DroppableDay({ day, children, currentDate, onEventDrop }: DroppableDayProps) {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'EVENT',
    drop: (item: DragItem) => {
      onEventDrop(item.eventId, item.originalDate, day)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [day, onEventDrop])

  return (
    <div
      ref={drop as any}
      className={`min-h-[100px] p-1 border ${
        isSameMonth(day, currentDate) ? "bg-background" : "bg-muted"
      } ${isOver ? 'bg-opacity-70' : ''}`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  )
} 