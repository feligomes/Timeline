"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { EVENT_COLORS, type EventColor } from "@/lib/constants"

interface EditEventDialogProps {
  event: {
    id: string
    title: string
    start: Date
    end: Date
    color: EventColor
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventUpdate: (eventId: string, updates: Partial<{ title: string; start: Date; end: Date; color: EventColor }>) => void
  onEventDelete: (eventId: string) => void
}

export function EditEventDialog({ event, open, onOpenChange, onEventUpdate, onEventDelete }: EditEventDialogProps) {
  const [title, setTitle] = React.useState(event.title)
  const [startDate, setStartDate] = React.useState<Date>(event.start)
  const [endDate, setEndDate] = React.useState<Date>(event.end)
  const [selectedColor, setSelectedColor] = React.useState<EventColor>(event.color)

  React.useEffect(() => {
    setTitle(event.title)
    setStartDate(event.start)
    setEndDate(event.end)
    setSelectedColor(event.color)
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startDate || !endDate) {
      return
    }
    
    if (endDate < startDate) {
      alert("End date must be after start date")
      return
    }

    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    onEventUpdate(event.id, { 
      title, 
      start,
      end,
      color: selectedColor 
    })
    
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      onEventDelete(event.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
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
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 