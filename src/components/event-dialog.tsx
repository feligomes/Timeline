"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { EVENT_COLORS, type EventColor } from "@/lib/constants"
import { DateRange } from "react-day-picker"
import { useAppDispatch } from "@/store/hooks"
import { addEvent, updateEvent, deleteEvent } from "@/store/slices/eventsSlice"

interface EventDialogProps {
  mode: 'add' | 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: {
    id: string
    title: string
    start: string
    end: string
    color: EventColor
  }
}

export function EventDialog({ mode, open, onOpenChange, event }: EventDialogProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [selectedColor, setSelectedColor] = React.useState<EventColor>(EVENT_COLORS[0].id)

  React.useEffect(() => {
    if (mode === 'edit' && event) {
      setTitle(event.title)
      setDateRange({ 
        from: parseISO(event.start), 
        to: parseISO(event.end) 
      })
      setSelectedColor(event.color)
    } else {
      setTitle("")
      setDateRange(undefined)
      setSelectedColor(EVENT_COLORS[0].id)
    }
  }, [mode, event, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dateRange?.from || !dateRange?.to) {
      return
    }

    const start = format(dateRange.from, 'yyyy-MM-dd')
    const end = format(dateRange.to, 'yyyy-MM-dd')

    if (mode === 'add') {
      dispatch(addEvent({ title, start, end, color: selectedColor }))
    } else if (mode === 'edit' && event) {
      dispatch(updateEvent({ 
        id: event.id, 
        updates: { title, start, end, color: selectedColor }
      }))
    }
    
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (mode === 'edit' && event) {
      if (confirm('Are you sure you want to delete this event?')) {
        dispatch(deleteEvent(event.id))
        onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === 'add' && (
        <DialogTrigger asChild>
          <Button variant="outline">Add Event</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Event' : 'Edit Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Event Color</Label>
            <div className="flex flex-wrap gap-2">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  style={{ backgroundColor: color.value }}
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color.id 
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-ring' 
                      : ''
                  }`}
                  title={color.name}
                  onClick={() => setSelectedColor(color.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Event Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  className="rounded-md"
                  classNames={{
                    day_range_start: "day-range-start !bg-blue-600 text-white",
                    day_range_end: "day-range-end !bg-blue-600 text-white",
                    day_selected: "!bg-blue-600 text-white hover:!bg-blue-700",
                    day_range_middle: "!bg-blue-100 hover:!bg-blue-200",
                    nav_button: "hover:bg-blue-50",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className={mode === 'add' ? 'w-full' : 'flex-1'}>
              {mode === 'add' ? 'Add Event' : 'Save Changes'}
            </Button>
            {mode === 'edit' && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 