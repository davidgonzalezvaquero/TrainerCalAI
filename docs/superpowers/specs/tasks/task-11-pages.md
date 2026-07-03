# Task 11: Pages

## Objective
Create Next.js pages for the application.

## Requirements

### Files to Create
- `src/app/dashboard/page.tsx` - Dashboard page
- `src/app/routines/page.tsx` - Routines page
- `src/app/meals/page.tsx` - Meals page
- `src/app/stats/page.tsx` - Stats page
- `src/app/settings/page.tsx` - Settings page

### Page Definitions

**Dashboard Page:**
- Uses MetricsCard, PolarWidget, LyftaWidget, CalendarWidget
- Sync buttons for Polar and Lyfta
- Day navigation

**Routines Page:**
- Uses ChatInterface component
- Full-height chat layout

**Meals Page:**
- Uses PhotoUpload component
- Food analysis interface

**Stats Page:**
- Progress visualization
- Macro distribution

**Settings Page:**
- Polar connection status
- Lyfta API key configuration
- User profile form

## Acceptance Criteria
- [ ] All 5 pages created
- [ ] Pages use UI components
- [ ] Pages have proper layout
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/11-pages`
- Commit message: `feat: add all pages (dashboard, routines, meals, stats, settings)`