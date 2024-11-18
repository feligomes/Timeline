import { EVENT_COLORS } from "./constants"
import { Event } from "@/types/calendar"

export const MOCK_EVENTS: Event[] = [
  { id: "1", title: "Vacation", start: "2024-11-05", end: "2024-11-10", color: EVENT_COLORS[6].id },
  { id: "2", title: "Conference", start: "2024-11-15", end: "2024-11-17", color: EVENT_COLORS[4].id },
  { id: "3", title: "Team Building", start: "2024-11-20", end: "2024-11-20", color: EVENT_COLORS[8].id },
] 