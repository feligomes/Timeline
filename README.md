# Timeline Event Visualizer

This is a [Next.js](https://nextjs.org) project that implements an interactive timeline component for visualizing events.

## Project Overview

This project implements a timeline visualization component with the following features:
- Space-efficient event layout that optimizes horizontal lanes
- Drag and drop functionality to modify event dates
- Month, week, and day view options
- Zoom controls for timeline navigation
- Inline event name editing
- Responsive design that works across different screen sizes

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [project-directory]
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
- The timeline layout algorithm prioritizes space efficiency while maintaining readability
- Used React Beautiful DND for smooth drag-and-drop interactions
- Implemented multiple calendar views (month/week/day) for better user experience, this works as a zoom level

### Features I Like
- The overall look and feel of the application
- The advanced drag and drop functionality that allows moving events by individual days
- The intuitive interface for event management
- The flexibility to view the calendar in different time scales (month/week/day)
- The possiblity to easily update existing events

### Future Improvements
- Implement a real API backend for event management
- Add user authentication and authorization
- Show user-specific event data based on login
- Improve responsiveness for small devices, potentially with a redesigned mobile-first interface
- Add data persistence
- Implement real-time updates

### Testing Approach
I would implement a comprehensive testing strategy including:
- End-to-end testing with Cypress to verify the complete user flow
- Unit testing with Jest for individual components and functions
- Integration tests for the drag and drop functionality
- Test coverage for different calendar views
- Accessibility testing
- Cross-browser compatibility testing

