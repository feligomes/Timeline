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
  DialogTrigger,
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

interface AddEventDialogProps {
  onAddEvent: (event: { title: string; start: Date; end: Date; color: EventColor }) => void
}

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [selectedColor, setSelectedColor] = React.useState<EventColor>(EVENT_COLORS[0].id)

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

    onAddEvent({ 
      title, 
      start,
      end,
      color: selectedColor 
    })
    
    setOpen(false)
    setTitle("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedColor(EVENT_COLORS[0].id)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
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
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date)
                      newDate.setHours(0, 0, 0, 0)
                      setStartDate(newDate)
                    } else {
                      setStartDate(undefined)
                    }
                  }}
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
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date)
                      newDate.setHours(23, 59, 59, 999)
                      setEndDate(newDate)
                    } else {
                      setEndDate(undefined)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 