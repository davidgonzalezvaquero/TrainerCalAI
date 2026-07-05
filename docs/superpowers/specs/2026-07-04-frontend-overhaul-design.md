# Frontend Overhaul Design Spec

**Date:** 2026-07-04
**Approach:** Fix & Wire — fix all bugs, wire date selection to API calls, add Zustand state management, shared types/hooks. No full rewrite.

## Problem Statement

The frontend has critical bugs (wrong calendar labels, broken photo upload, non-existent chat API), disconnected features (date selection does nothing, hardcoded metrics, static pages), and no error feedback. The app looks like a mockup rather than a functional tool.

## Scope

Full overhaul of all pages: dashboard, meals, routines, stats, settings. Focus on making every feature work with real data.

## Architecture Changes

### 1. Shared Infrastructure

**New files:**
- `src/lib/api-client.ts` — shared fetch wrapper with error handling, userId injection
- `src/lib/constants.ts` — `DEV_USER_ID = '00000000-0000-0000-0000-000000000001'`
- `src/hooks/useSync.ts` — shared hook for sync operations (loading/error state)

**Zustand store** (`src/stores/dashboard-store.ts`):
- `selectedDate: Date` — currently selected calendar date (default: today)
- `refreshKey: number` — incremented after sync to trigger widget refresh
- `setSelectedDate(date)` / `incrementRefresh()`

### 2. Root Page

- Redirect `/` to `/dashboard`

### 3. Navigation

- Consistent Spanish labels: Panel, Rutinas, Comidas, Estadísticas, Configuración

### 4. Calendar Widget

**Fixes:**
- Day labels: use `['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']` indexed by `date.getDay()`
- Week starts Monday (logic already correct, labels were wrong)

**Enhancements:**
- Previous/next week navigation arrows
- Connect to Zustand store for selectedDate

### 5. Dashboard Page

**MetricsCards:** Replace hardcoded values with real data fetched for `selectedDate`:
- Calories: from Polar activity
- Duration: from Polar activity (formatted as hours/minutes)
- Sleep: from Polar sleep (formatted as hours)
- Workouts: count from Lyfta workouts

**Data flow:**
1. `selectedDate` from Zustand store
2. On date change or sync, fetch data for that date
3. Pass data down to MetricsCards and widgets
4. Widgets accept `date` prop

### 6. Polar Widget

**Fixes:**
- Accept `date` prop, fetch data for that specific date
- Add error state (show error message or retry button instead of infinite loading)
- Add manual refresh button

**New API route:** `GET /api/polar/date?date=YYYY-MM-DD` — returns Polar data for a specific date

### 7. Lyfta Widget

**Fixes:**
- Accept `date` prop, filter workouts by date
- Show workout name (currently null), duration, volume
- Add error state and manual refresh button

**New API route:** `GET /api/lyfta/date?date=YYYY-MM-DD` — returns workout for a specific date

### 8. Meals Page

**Fix race condition:**
- Move API call inside `reader.onloadend` callback (not before)
- Add `userId` to the request body

**Enhancements:**
- Add error feedback UI (toast or inline message)
- Add "New photo" button after analysis
- Show loading state properly

### 9. Routines Page

**Fix:**
- Create `/api/routines/chat/route.ts` that wraps the existing `GenerateRoutineUseCase` — accepts a chat message, uses it as the user's workout preferences, returns the generated routine as a chat response
- Add `userId` to requests
- Add error feedback in chat UI (show error message below the failed message)
- Show loading indicator ("Pensando...") while waiting for response

### 10. Stats Page

**Replace hardcoded values with real data:**
- Weight progress: from user profile (Supabase `user_profiles` table)
- Volume/calories: aggregated from Polar activities
- Macro distribution: from meal analyses (Supabase `meals` table)

**New API route:** `GET /api/stats` — returns aggregated stats for the user

### 11. Settings Page

**Fixes:**
- On mount, read `?success=polar_connected` query param → show success message
- On mount, check actual connection status from API (`GET /api/polar/status`)
- Save Lyfta API key to Supabase connections table
- Save user profile (height, weight, goal, experience) to Supabase `user_profiles`
- Show success/error feedback after save

**New API routes:**
- `GET /api/polar/status` — returns connection status for the user
- `POST /api/settings/profile` — save user profile
- `POST /api/settings/lyfta-key` — save Lyfta API key

## File Changes Summary

### New Files
- `src/lib/api-client.ts`
- `src/lib/constants.ts`
- `src/hooks/useSync.ts`
- `src/stores/dashboard-store.ts`
- `src/app/api/polar/date/route.ts`
- `src/app/api/lyfta/date/route.ts`
- `src/app/api/polar/status/route.ts`
- `src/app/api/settings/profile/route.ts`
- `src/app/api/settings/lyfta-key/route.ts`
- `src/app/api/stats/route.ts`
- `src/app/api/routines/chat/route.ts`

### Modified Files
- `src/app/page.tsx` — redirect to /dashboard
- `src/app/dashboard/page.tsx` — use Zustand store, wire data fetching
- `src/app/settings/page.tsx` — wire connection status, save profile
- `src/app/meals/page.tsx` — no changes (delegates to PhotoUpload)
- `src/app/routines/page.tsx` — no changes (delegates to ChatInterface)
- `src/app/stats/page.tsx` — wire to real data
- `src/ui/components/shared/navigation.tsx` — Spanish labels
- `src/ui/components/dashboard/calendar-widget.tsx` — fix labels, add week nav
- `src/ui/components/dashboard/polar-widget.tsx` — accept date prop, error handling
- `src/ui/components/dashboard/lyfta-widget.tsx` — accept date prop, show name/volume
- `src/ui/components/dashboard/metrics-card.tsx` — no changes (already good)
- `src/ui/components/meals/photo-upload.tsx` — fix race condition, add userId
- `src/ui/components/routines/chat-interface.tsx` — fix API route, add error handling

## Implementation Order

1. Shared infrastructure (constants, api-client, Zustand store)
2. Root redirect + navigation labels
3. Calendar widget fix + week navigation
4. Dashboard wiring (date selection → data fetching)
5. Polar widget + date API route
6. Lyfta widget + date API route
7. Meals page fix
8. Routines chat fix
9. Stats page wiring
10. Settings page wiring
11. Final testing and polish
