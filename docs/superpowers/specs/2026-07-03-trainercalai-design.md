# TrainerCalAI - Design Spec

**Date:** 2026-07-03
**Status:** Approved
**Author:** opencode + user

## Overview

Personal fitness application combining AI-powered food analysis (like Cal AI) with workout tracking (like Lyfta), connected to Polar watch and Lyfta app via APIs. Features AI-generated personalized workout routines.

## Goals

1. Centralize fitness data from multiple sources (Polar, Lyfta, manual)
2. AI-powered food photo analysis for calorie/macro tracking
3. Personalized workout routine generation based on user data
4. Push generated routines back to Lyfta
5. Single-user app (private use only)

## Architecture

### Hexagonal Architecture (Ports & Adapters)

```
src/
├── app/                    # Next.js App Router (pages + API routes)
├── domain/                 # Core business logic
│   ├── entities/          # Workout, Meal, PolarData, User, Routine
│   └── interfaces/        # Ports (contracts)
├── infrastructure/        # External adapters
│   ├── api/               # Polar, Lyfta, OpenAI, Claude adapters
│   ├── storage/           # Supabase adapter
│   └── ai/                # AI service adapters
├── application/           # Use cases
│   └── usecases/          # GenerateRoutine, AnalyzeMeal, SyncPolar, etc.
└── ui/                    # React components
    ├── components/
    └── hooks/
```

### Data Flow

```
Polar Watch → Polar API (OAuth2) → Next.js API → Supabase
Lyfta App → Lyfta API (Bearer) → Next.js API → Supabase

User (chat) → Claude API → Routine JSON → Supabase + Lyfta API

Food Photo → OpenAI GPT-4 Vision → Macros → Supabase
```

## Data Model (Supabase/PostgreSQL)

```sql
-- Users (Supabase Auth)
users: id, email, created_at

-- Fitness profile
profiles: user_id, height, weight, body_fat, target_weight, goal, experience_level

-- External connections
connections: user_id, provider (polar|lyfta), access_token, refresh_token, expires_at

-- Polar data (synced)
polar_activities: user_id, date, calories, heart_rate_avg, heart_rate_max, duration, sleep_score, nightly_recharge
polar_sleep: user_id, date, sleep_duration, sleep_score, deep_sleep, rem_sleep, light_sleep

-- Lyfta data (synced)
lyfta_workouts: user_id, date, name, exercises (JSONB), duration, volume, intensity
lyfta_personal_records: user_id, exercise_id, weight, reps, date

-- Meals
meals: user_id, date, time, name, calories, protein, carbs, fat, photo_url, analysis_source (ai|manual)

-- Generated routines
routines: user_id, name, created_at, exercises (JSONB), goal, difficulty, duration_weeks
routine_logs: user_id, routine_id, exercise_id, sets, reps, weight, completed_at
```

## Integrations

### Polar AccessLink API v3

- **Auth:** OAuth2 (register at admin.polaraccesslink.com)
- **Endpoints:** `/v3/users/{id}/activities`, `/v3/users/{id}/sleep`, `/v3/users/{id}/exercises`
- **Webhooks:** Real-time sync when Polar syncs
- **Rate limits:** 1 req/sec, burst 100
- **Data available:** Exercise intensity, daily activity, sleep, heart rate, Nightly Recharge, HRV

### Lyfta Developer API

- **Auth:** Bearer token (generate at my.lyfta.app/community/api)
- **Endpoints:**
  - `GET /api/v1/workouts` → workout history
  - `GET /api/v1/exercises` → available exercises
  - `POST /api/v1/templates` → push generated routines
- **Limitations:** Read-only for workouts, write for templates/collections

### AI - Food Analysis (OpenAI GPT-4 Vision)

- **Input:** Food photo
- **Prompt:** Specialized for calorie/macro estimation
- **Output:** `{ calories, protein, carbs, fat, confidence, description }`

### AI - Routine Generation (Claude API)

- **Input:** Polar data + Lyfta history + goals + sleep/recovery data
- **System prompt:** Fitness expert knowledge
- **Output:** Structured JSON routine with exercises, sets, reps, weights

## UI/UX

### Screens

1. **Dashboard** - Daily summary with:
   - Calorie target vs consumed/burned
   - Sleep data from Polar
   - Heart rate metrics
   - Last workout from Lyfta
   - 7-day history calendar
   - Sync buttons for Polar and Lyfta
   - Day navigation (previous/next)

2. **Routine Generator** - Chat interface:
   - Conversational with AI trainer
   - Form for initial setup (goals, equipment, availability)
   - Chat for adjustments
   - Push routine to Lyfta button

3. **Meal Tracker** - Photo analysis:
   - Upload food photo
   - AI analysis results (calories, macros)
   - Meal history
   - Daily macro progress

4. **Stats** - Progress tracking:
   - Weight/body composition trends
   - Volume/strength progress from Lyfta
   - Calorie trends
   - Sleep quality trends

5. **Settings** - Configuration:
   - Polar connection status/reconnect
   - Lyfta API key configuration
   - AI provider settings
   - Profile and goals

### Visual Style

- Dark minimalist theme
- Tailwind CSS + shadcn/ui components
- Responsive (desktop-first, mobile-friendly)

## Tech Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | Next.js 14+ (App Router) | React with SSR, API routes, Server Actions |
| UI | Tailwind CSS + shadcn/ui | Dark theme, clean components |
| State | Zustand | Lightweight, TypeScript first |
| Backend | Next.js API Routes | Hexagonal with route handlers |
| Database | Supabase (PostgreSQL) | Auth, storage, real-time |
| Auth | Supabase Auth | Simple for personal use |
| AI Photos | OpenAI GPT-4 Vision | Best image analysis |
| AI Routines | Claude API (Anthropic) | Best reasoning for fitness |
| Polar | Polar AccessLink API v3 | OAuth2, webhooks |
| Lyfta | Lyfta Developer API | API key, REST |
| Deploy | Vercel | Native Next.js integration |

## Scope - MVP

### Phase 1: Core (Week 1-2)
- Project setup with hexagonal architecture
- Supabase setup (auth + database)
- Polar OAuth integration + data sync
- Lyfta API integration + data sync
- Basic dashboard with synced data

### Phase 2: AI Features (Week 3-4)
- Food photo analysis (GPT-4 Vision)
- Routine generation (Claude API)
- Chat interface for routines
- Push routines to Lyfta

### Phase 3: Polish (Week 5)
- Stats/progress views
- Day navigation and history
- Error handling and loading states
- Mobile responsiveness

## Prerequisites (User Actions Required)

Before development can begin, the user must complete these setup steps:

1. **Polar AccessLink Registration:**
   - Create account at admin.polaraccesslink.com
   - Register new application
   - Obtain client_id and client_secret
   - Set redirect_uri to `http://localhost:3000/api/polar/callback`

2. **Lyfta API Key:**
   - Log in at my.lyfta.app/community/api
   - Generate API key
   - Store key securely

3. **AI Provider Keys:**
   - OpenAI: Create account, add billing, get API key (for GPT-4 Vision)
   - Anthropic: Create account, add billing, get API key (for Claude)

4. **Supabase Project:**
   - Create project at supabase.com
   - Note project URL and anon key
   - Enable Auth (email/password is sufficient for personal use)

## Success Criteria

- Can sync Polar data automatically
- Can sync Lyfta workouts
- Can analyze food photos with >80% accuracy
- Can generate personalized routines based on user data
- Can push routines to Lyfta
- All data visible in unified dashboard