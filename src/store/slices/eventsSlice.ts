import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Event, EventColor } from '@/types/calendar'

interface EventsState {
  events: Event[]
  nextEventId: number
}

const initialState: EventsState = {
  events: [],
  nextEventId: 1
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    initializeEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload
      state.nextEventId = action.payload.length + 1
    },
    addEvent: (state, action: PayloadAction<{
      title: string
      start: string
      end: string
      color: EventColor
    }>) => {
      const event: Event = {
        id: state.nextEventId.toString(),
        ...action.payload
      }
      state.events.push(event)
      state.nextEventId += 1
    },
    updateEvent: (state, action: PayloadAction<{
      id: string
      updates: Partial<Event>
    }>) => {
      const { id, updates } = action.payload
      const event = state.events.find(e => e.id === id)
      if (event) {
        Object.assign(event, updates)
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(e => e.id !== action.payload)
    },
    moveEvent: (state, action: PayloadAction<{
      eventId: string
      daysDiff: number
    }>) => {
      const { eventId, daysDiff } = action.payload
      const event = state.events.find(e => e.id === eventId)
      if (event) {
        const newStart = new Date(event.start)
        const newEnd = new Date(event.end)
        newStart.setDate(newStart.getDate() + daysDiff)
        newEnd.setDate(newEnd.getDate() + daysDiff)
        event.start = newStart.toISOString().split('T')[0]
        event.end = newEnd.toISOString().split('T')[0]
      }
    }
  }
})

export const { 
  initializeEvents, 
  addEvent, 
  updateEvent, 
  deleteEvent, 
  moveEvent 
} = eventsSlice.actions

export default eventsSlice.reducer 