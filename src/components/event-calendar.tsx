"use client"

import * as React from "react"
import { addDays, addMonths, addWeeks, subMonths, subWeeks, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isWithinInterval, differenceInDays, startOfDay } from "date-fns"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AddEventDialog } from "@/components/add-event-dialog"
import { EVENT_COLORS, type EventColor } from "@/lib/constants"
import { EditEventDialog } from "@/components/edit-event-dialog"

interface Event {
  id: string
  title: string
  start: Date
  end: Date
  color: EventColor
}

interface DragItem {
  eventId: string
  originalDate: Date
}

interface EditableEventProps {
  event: Event
  day: Date
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void
  onEventDelete: (eventId: string) => void
}

const mockEvents: Event[] = [
  { id: "1", title: "Vacation", start: new Date(new Date().getFullYear(), 10, 5), end: new Date(new Date().getFullYear(), 10, 10), color: EVENT_COLORS[6].id },
  { id: "2", title: "Conference", start: new Date(new Date().getFullYear(), 10, 15), end: new Date(new Date().getFullYear(), 10, 17), color: EVENT_COLORS[4].id },
  { id: "3", title: "Team Building", start: new Date(new Date().getFullYear(), 10, 20), end: new Date(new Date().getFullYear(), 10, 20), color: EVENT_COLORS[8].id },
]


type ViewMode = 'month' | 'week' | 'day'

function DraggableEvent({ event, day, onEventUpdate, onEventDelete }: EditableEventProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVENT',
    item: { eventId: event.id, originalDate: day },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

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

      <EditEventDialog
        event={event}
        open={isEditing}
        onOpenChange={setIsEditing}
        onEventUpdate={onEventUpdate}
        onEventDelete={onEventDelete}
      />
    </>
  )
}

function DroppableDay({ 
  day, 
  children, 
  onEventDrop,
  currentDate 
}: { 
  day: Date, 
  children: React.ReactNode,
  onEventDrop: (eventId: string, originalDate: Date, newDate: Date) => void,
  currentDate: Date
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'EVENT',
    drop: (item: DragItem) => {
      onEventDrop(item.eventId, item.originalDate, day)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`min-h-[100px] p-1 border ${
        isSameMonth(day, currentDate) ? "bg-background" : "bg-muted"
      } ${isOver ? 'bg-opacity-70' : ''}`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  )
}

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [viewMode, setViewMode] = React.useState<ViewMode>('month')
  const [events, setEvents] = React.useState<Event[]>(mockEvents)

  console.log(events) 

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

  const renderMonthView = () => (
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
          onEventDrop={handleEventDrop}
          currentDate={currentDate}
        >
          <div className="text-sm font-medium">{format(day, 'd')}</div>
          <div className="mt-1 space-y-1 overflow-y-auto">
            {getEventsForDay(day).map(event => (
              <DraggableEvent 
                key={event.id} 
                event={event} 
                day={day}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleDelete}
              />
            ))}
          </div>
        </DroppableDay>
      ))}
    </div>
  )

  const renderWeekView = () => (
    <div className="flex flex-col gap-1" style={{ width: '700px' }}>
      {daysToDisplay.map(day => (
        <DroppableDay 
          key={day.toString()} 
          day={day} 
          onEventDrop={handleEventDrop}
          currentDate={currentDate}
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
                  onEventUpdate={handleEventUpdate}
                  onEventDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </DroppableDay>
      ))}
    </div>
  )

  const renderDayView = () => (
    <div className="flex flex-col" style={{ width: '700px', height: '550px' }}>
      <div className="flex border bg-background h-full">
        <div className="w-[100px] p-4 border-r">
          <div className="font-semibold">{format(currentDate, 'EEE')}</div>
          <div className="text-2xl">{format(currentDate, 'd')}</div>
        </div>
        <div className="flex-1 p-4 space-y-2">
          {getEventsForDay(currentDate).map(event => {
            const colorObj = EVENT_COLORS.find(c => c.id === event.color)
            return (
              <div
                key={event.id}
                className={`p-3 rounded-lg text-white shadow-sm`}
                style={{ backgroundColor: colorObj?.value }}
                title={event.title}
              >
                <div className="text-sm font-medium">{event.title}</div>
                <div className="text-xs opacity-90 mt-1">
                  {format(event.start, 'MMM d')} - {format(event.end, 'MMM d')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{format(currentDate, viewMode === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}</h1>
            <div className="flex items-center gap-4 h-10">
              <AddEventDialog onAddEvent={handleAddEvent} />
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
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] flex items-center justify-center">
            <div className="p-4">
              {viewMode === 'month' && renderMonthView()}
              {viewMode === 'week' && renderWeekView()}
              {viewMode === 'day' && renderDayView()}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </DndProvider>
  )
}