export const EVENT_COLORS = [
  { id: 'bg-[#D50000]', name: 'Tomato', value: '#D50000' },
  { id: 'bg-[#E67C73]', name: 'Flamingo', value: '#E67C73' },
  { id: 'bg-[#F4511E]', name: 'Tangerine', value: '#F4511E' },
  { id: 'bg-[#F6BF26]', name: 'Banana', value: '#F6BF26' },
  { id: 'bg-[#33B679]', name: 'Sage', value: '#33B679' },
  { id: 'bg-[#0B8043]', name: 'Basil', value: '#0B8043' },
  { id: 'bg-[#039BE5]', name: 'Peacock', value: '#039BE5' },
  { id: 'bg-[#3F51B5]', name: 'Blueberry', value: '#3F51B5' },
  { id: 'bg-[#7986CB]', name: 'Lavender', value: '#7986CB' },
] as const;

export type EventColor = typeof EVENT_COLORS[number]['id']; 