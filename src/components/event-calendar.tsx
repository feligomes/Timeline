"use client"

import * as React from "react"
import { addDays, addMonths, addWeeks, subMonths, subWeeks, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, differenceInDays, startOfDay } from "date-fns"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { EventDialog } from "@/components/event-dialog"
import { MonthView } from "./calendar-views/month-view"
import { WeekView } from "./calendar-views/week-view"
import { DayView } from "./calendar-views/day-view"
import { ViewMode } from "@/types/calendar"
import { Event } from "@/types/calendar"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { initializeEvents, moveEvent } from "@/store/slices/eventsSlice"

interface EventCalendarProps {
  initialEvents: Event[]
}

export default function EventCalendar({ initialEvents }: EventCalendarProps) {
  const dispatch = useAppDispatch()
  const events = useAppSelector(state => state.events.events)
  
  useEffect(() => {
    dispatch(initializeEvents(initialEvents))
  }, [dispatch, initialEvents])

  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [viewMode, setViewMode] = React.useState<ViewMode>('month')
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
    const dayString = format(day, 'yyyy-MM-dd')
    return events.filter(event => {
      return dayString >= event.start && dayString <= event.end
    })
  }

  const handleEventDrop = (eventId: string, originalDate: Date, newDate: Date) => {
    const daysDiff = differenceInDays(newDate, originalDate)
    dispatch(moveEvent({ eventId, daysDiff }))
  }

  const renderView = () => {
    const props = {
      daysToDisplay: getDaysToDisplay(),
      currentDate,
      events,
      onEventDrop: handleEventDrop,
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
            <h1 className="text-2xl font-semibold">
              {format(currentDate, viewMode === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
            </h1>
            <div className="flex items-center gap-4 h-10">
              <EventDialog 
                mode="add"
                open={isAddEventOpen}
                onOpenChange={setIsAddEventOpen}
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