# Task 10: UI Components

## Objective
Create React UI components for the application.

## Requirements

### Files to Create
- `src/ui/components/dashboard/metrics-card.tsx` - Metrics display card
- `src/ui/components/dashboard/polar-widget.tsx` - Polar data widget
- `src/ui/components/dashboard/lyfta-widget.tsx` - Lyfta workout widget
- `src/ui/components/dashboard/calendar-widget.tsx` - Calendar navigation
- `src/ui/components/routines/chat-interface.tsx` - Chat with AI trainer
- `src/ui/components/meals/photo-upload.tsx` - Food photo upload

### Component Definitions

**MetricsCard:**
- Props: title, value, subtitle, color
- Displays a single metric with styling

**PolarWidget:**
- Fetches and displays Polar data (Nightly Recharge, HRV, steps)

**LyftaWidget:**
- Fetches and displays last workout from Lyfta

**CalendarWidget:**
- 7-day calendar view with date selection

**ChatInterface:**
- Conversational UI for routine generation
- Message history, input field, send button

**PhotoUpload:**
- File upload for food photos
- Displays AI analysis results

## Acceptance Criteria
- [ ] All 6 components created
- [ ] Components use Tailwind CSS for styling
- [ ] Components are properly typed with TypeScript
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/10-ui-components`
- Commit message: `feat: add UI components for dashboard, routines, and meals`