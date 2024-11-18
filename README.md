# Timeline Event Visualizer

This is a [Next.js](https://nextjs.org) project that implements an interactive timeline component for visualizing events.

🚀 **Live Demo**: [https://timeline-manager.vercel.app/](https://timeline-manager.vercel.app/)

## Project Overview

This project implements a timeline visualization component with the following features:
- Drag and drop functionality to modify event dates, from both the month and week views
- Zoom controls for timeline navigation (Month, week, and day view options)
- Event editing by double clicking on the event, works from all views
- Ability to add new custom events aswell as delete existing ones
- It correctly handles long names, showing a tooltip with the full name when hovering over the event 

Technical details:
- The app is integrated with Redux and it manages the state of the events using it 
- It comes prepopulated with 3 events added on November 2024 as a small demo, new events can be added freely
- The data resets if you reload the page, this could have been made persistent with a real backend, using localstorage or a database
- Left it this way also a way to easilty reset the application for testing purposes
- The calendar component receives an array of events and renders them. In the working demo it is using data from mock-data.ts file, they can be easily changed to a different set of events to test the application. Or eventually connected to a real backend to fetch the initial data.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/feligomes/Timeline
cd Timeline
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Implementation Details

### Time Spent
I spent approximately 4 hours implementing this project.

### Design Decisions
- Used Shadcn UI to create a modern look and feel aswell as using a future-proof component library
- Used React Beautiful DND for smooth drag-and-drop interactions
- Managed date-fns to handle date manipulations
- I used Google Calendar as a reference for the design of the calendar

### Features I Like
- The overall look and feel of the application
- The possibility to add new events and use custom colors for each one making them easier to identify
- The drag and drop functionality that allows moving events by specific days. You can for example move the 3rd day of the event to another day and the event will be updated accordingly

### Future Improvements
- Implement a real API backend for event management
- Add user authentication and authorization
- Show user-specific event data based on login
- Improve responsiveness for small devices, potentially with a redesigned mobile-first interface
- Implement real-time updates if we were to allow multiple users to interact with the same events
- Add test coverage for the application
- Go into depth into accessibility, making the application more usable. 

### Testing Approach
I would implement a comprehensive testing strategy including:
- End-to-end testing with Cypress to verify the complete user flow
- Unit testing with Jest for individual components and functions
- Integration tests for the drag and drop functionality
- Test coverage for different calendar views
- Accessibility testing
- Cross-browser compatibility testing

