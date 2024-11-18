import type { EventColor } from "@/lib/constants"

export interface Event {
  id: string
  title: string
  start: string
  end: string
  color: EventColor
}

export interface DragItem {
  eventId: string
  originalDate: Date
}

export type ViewMode = 'month' | 'week' | 'day' 