"use client"

import * as React from "react"
import { addDays, addMonths, addWeeks, subMonths, subWeeks, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval, differenceInDays, startOfDay } from "date-fns"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { EventDialog } from "@/components/event-dialog"
import { EVENT_COLORS, type EventColor } from "@/lib/constants"
import { MonthView } from "./calendar-views/month-view"
import { WeekView } from "./calendar-views/week-view"
import { DayView } from "./calendar-views/day-view"

interface Event {
  id: string
  title: string
  start: Date
  end: Date
  color: EventColor
}

const mockEvents: Event[] = [
  { id: "1", title: "Vacation", start: new Date(new Date().getFullYear(), 10, 5), end: new Date(new Date().getFullYear(), 10, 10), color: EVENT_COLORS[6].id },
  { id: "2", title: "Conference", start: new Date(new Date().getFullYear(), 10, 15), end: new Date(new Date().getFullYear(), 10, 17), color: EVENT_COLORS[4].id },
  { id: "3", title: "Team Building", start: new Date(new Date().getFullYear(), 10, 20), end: new Date(new Date().getFullYear(), 10, 20), color: EVENT_COLORS[8].id },
]


type ViewMode = 'month' | 'week' | 'day'

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [viewMode, setViewMode] = React.useState<ViewMode>('month')
  const [events, setEvents] = React.useState<Event[]>(mockEvents)
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false)

  const prevPeriod = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(subDays(currentDate, 1))
        break
    }
  }

  const nextPeriod = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(addDays(currentDate, 1))
        break
    }
  }

  const getDaysToDisplay = () => {
    switch (viewMode) {
      case 'month':
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        return eachDayOfInterval({ start: monthStart, end: monthEnd })
      case 'week':
        const weekStart = startOfWeek(currentDate)
        const weekEnd = endOfWeek(currentDate)
        return eachDayOfInterval({ start: weekStart, end: weekEnd })
      case 'day':
        return [startOfDay(currentDate)]
    }
  }

  const getEventsForDay = (day: Date) => {
    const normalizedDay = startOfDay(day)
    return events.filter(event => {
      const eventStart = startOfDay(event.start)
      const eventEnd = startOfDay(event.end)
      return isWithinInterval(normalizedDay, { start: eventStart, end: eventEnd })
    })
  }

  const handleEventDrop = (eventId: string, originalDate: Date, newDate: Date) => {
    setEvents(prevEvents => {
      return prevEvents.map(event => {
        if (event.id === eventId) {
          const daysDiff = differenceInDays(newDate, originalDate)
          return {
            ...event,
            start: addDays(event.start, daysDiff),
            end: addDays(event.end, daysDiff),
          }
        }
        return event
      })
    })
  }

  const handleEventUpdate = (eventId: string, updates: Partial<Event>) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, ...updates }
          : event
      )
    )
  }

  const handleAddEvent = (newEvent: { title: string; start: Date; end: Date; color: EventColor }) => {
    const event: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
      color: newEvent.color
    }
    setEvents(prev => [...prev, event])
  }

  const handleDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }

  const daysToDisplay = getDaysToDisplay()

  const renderView = () => {
    const props = {
      daysToDisplay,
      currentDate,
      events,
      onEventDrop: handleEventDrop,
      onEventUpdate: handleEventUpdate,
      onEventDelete: handleDelete,
      getEventsForDay
    }

    switch (viewMode) {
      case 'month':
        return <MonthView {...props} />
      case 'week':
        return <WeekView {...props} />
      case 'day':
        return <DayView {...props} />
      default:
        return null
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{format(currentDate, viewMode === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}</h1>
            <div className="flex items-center gap-4 h-10">
              <EventDialog 
                mode="add"
                open={isAddEventOpen}
                onOpenChange={setIsAddEventOpen}
                onAddEvent={handleAddEvent}
              />
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger className="w-[120px] h-10">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button variant="outline" className="h-10" onClick={prevPeriod}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-10" onClick={nextPeriod}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-[600px] flex items-center justify-center">
            <div className="p-4">
              {renderView()}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </DndProvider>
  )
}