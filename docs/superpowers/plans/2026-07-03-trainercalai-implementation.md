# TrainerCalAI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal fitness app with AI food analysis, workout tracking from Polar/Lyfta, and AI-generated routines

**Architecture:** Hexagonal architecture with Next.js 14+ (App Router), Supabase for storage/auth, and separate adapters for Polar, Lyfta, OpenAI, and Claude APIs

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Zustand, OpenAI GPT-4 Vision, Claude API, Polar AccessLink API v3, Lyfta Developer API

---

## File Structure

```
trainercalai/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── routines/
│   │   │   └── page.tsx
│   │   ├── meals/
│   │   │   └── page.tsx
│   │   ├── stats/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── polar/
│   │       │   ├── authorize/route.ts
│   │       │   ├── callback/route.ts
│   │       │   └── sync/route.ts
│   │       ├── lyfta/
│   │       │   ├── workouts/route.ts
│   │       │   └── sync/route.ts
│   │       ├── nutrition/
│   │       │   └── analyze/route.ts
│   │       ├── routines/
│   │       │   ├── generate/route.ts
│   │       │   └── push/route.ts
│   │       └── sync/
│   │           └── all/route.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.ts
│   │   │   ├── workout.ts
│   │   │   ├── meal.ts
│   │   │   ├── polar-data.ts
│   │   │   └── routine.ts
│   │   └── interfaces/
│   │       ├── polar-port.ts
│   │       ├── lyfta-port.ts
│   │       ├── ai-port.ts
│   │       └── storage-port.ts
│   ├── infrastructure/
│   │   ├── api/
│   │   │   ├── polar-adapter.ts
│   │   │   ├── lyfta-adapter.ts
│   │   │   ├── openai-adapter.ts
│   │   │   └── claude-adapter.ts
│   │   ├── storage/
│   │   │   └── supabase-adapter.ts
│   │   └── auth/
│   │       └── supabase-auth.ts
│   ├── application/
│   │   └── usecases/
│   │       ├── sync-polar.ts
│   │       ├── sync-lyfta.ts
│   │       ├── analyze-meal.ts
│   │       ├── generate-routine.ts
│   │       └── push-routine.ts
│   └── ui/
│       ├── components/
│       │   ├── dashboard/
│       │   │   ├── metrics-card.tsx
│       │   │   ├── polar-widget.tsx
│       │   │   ├── lyfta-widget.tsx
│       │   │   └── calendar-widget.tsx
│       │   ├── routines/
│       │   │   ├── chat-interface.tsx
│       │   │   └── routine-card.tsx
│       │   ├── meals/
│       │   │   ├── photo-upload.tsx
│       │   │   └── macro-display.tsx
│       │   └── shared/
│       │       ├── sync-button.tsx
│       │       └── loading-spinner.tsx
│       ├── hooks/
│       │   ├── use-polar.ts
│       │   ├── use-lyfta.ts
│       │   ├── use-meals.ts
│       │   └── use-routines.ts
│       └── lib/
│           ├── supabase-client.ts
│           └── utils.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## Task 1: Project Setup & Dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.js`
- Create: `.env.local.example`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest trainercalai --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

- [ ] **Step 2: Install dependencies**

```bash
cd trainercalai
npm install @supabase/supabase-js zustand openai @anthropic-ai/sdk
npm install -D @types/node
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label tabs
```

- [ ] **Step 4: Create .env.local.example**

```bash
cat > .env.local.example << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Polar
POLAR_CLIENT_ID=your_polar_client_id
POLAR_CLIENT_SECRET=your_polar_client_secret
POLAR_REDIRECT_URI=http://localhost:3000/api/polar/callback

# Lyfta
LYFTA_API_KEY=your_lyfta_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Claude
ANTHROPIC_API_KEY=your_anthropic_api_key
EOF
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with dependencies"
```

---

## Task 2: Domain Entities

**Files:**
- Create: `src/domain/entities/user.ts`
- Create: `src/domain/entities/workout.ts`
- Create: `src/domain/entities/meal.ts`
- Create: `src/domain/entities/polar-data.ts`
- Create: `src/domain/entities/routine.ts`

- [ ] **Step 1: Create User entity**

```typescript
// src/domain/entities/user.ts
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Profile {
  userId: string;
  height: number; // cm
  weight: number; // kg
  bodyFat?: number;
  targetWeight?: number;
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface Connection {
  userId: string;
  provider: 'polar' | 'lyfta';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}
```

- [ ] **Step 2: Create Workout entity**

```typescript
// src/domain/entities/workout.ts
export interface Workout {
  id: string;
  userId: string;
  date: Date;
  name: string;
  exercises: Exercise[];
  duration: number; // minutes
  volume: number; // kg
  intensity: number; // 1-10
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  muscleGroup: string;
  equipment?: string;
}

export interface Set {
  reps: number;
  weight: number;
  rpe?: number;
  isWarmup?: boolean;
  isDropSet?: boolean;
}

export interface PersonalRecord {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: Date;
}
```

- [ ] **Step 3: Create Meal entity**

```typescript
// src/domain/entities/meal.ts
export interface Meal {
  id: string;
  userId: string;
  date: Date;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photoUrl?: string;
  analysisSource: 'ai' | 'manual';
  confidence?: number;
  description?: string;
}

export interface DailyMacros {
  date: string;
  calories: { consumed: number; target: number; burned: number };
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
}
```

- [ ] **Step 4: Create Polar Data entity**

```typescript
// src/domain/entities/polar-data.ts
export interface PolarActivity {
  id: string;
  userId: string;
  date: Date;
  calories: number;
  heartRateAvg: number;
  heartRateMax: number;
  duration: number; // minutes
  sleepScore?: number;
  nightlyRecharge?: number;
}

export interface PolarSleep {
  id: string;
  userId: string;
  date: Date;
  sleepDuration: number; // minutes
  sleepScore: number;
  deepSleep: number; // minutes
  remSleep: number; // minutes
  lightSleep: number; // minutes
}

export interface PolarDailyActivity {
  userId: string;
  date: Date;
  steps: number;
  calories: number;
  activeMinutes: number;
  heartRateVariability?: number;
}
```

- [ ] **Step 5: Create Routine entity**

```typescript
// src/domain/entities/routine.ts
export interface Routine {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  exercises: RoutineExercise[];
  goal: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
}

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string; // e.g., "8-12" or "AMRAP"
  weight?: number;
  restSeconds: number;
  notes?: string;
}

export interface RoutineLog {
  id: string;
  userId: string;
  routineId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  completedAt: Date;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/domain/
git commit -m "feat: add domain entities"
```

---

## Task 3: Domain Interfaces (Ports)

**Files:**
- Create: `src/domain/interfaces/polar-port.ts`
- Create: `src/domain/interfaces/lyfta-port.ts`
- Create: `src/domain/interfaces/ai-port.ts`
- Create: `src/domain/interfaces/storage-port.ts`

- [ ] **Step 1: Create Polar Port**

```typescript
// src/domain/interfaces/polar-port.ts
import { PolarActivity, PolarSleep, PolarDailyActivity } from '../entities/polar-data';

export interface PolarPort {
  getAuthorizationUrl(): string;
  exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }>;
  getActivities(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarActivity[]>;
  getSleep(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarSleep[]>;
  getDailyActivity(userId: string, accessToken: string, date: Date): Promise<PolarDailyActivity>;
}
```

- [ ] **Step 2: Create Lyfta Port**

```typescript
// src/domain/interfaces/lyfta-port.ts
import { Workout, PersonalRecord } from '../entities/workout';
import { Routine } from '../entities/routine';

export interface LyftaPort {
  getWorkouts(apiKey: string, page?: number, limit?: number): Promise<Workout[]>;
  getExercises(apiKey: string): Promise<{ id: string; name: string; muscleGroup: string }[]>;
  pushRoutine(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }>;
}
```

- [ ] **Step 3: Create AI Port**

```typescript
// src/domain/interfaces/ai-port.ts
import { Meal } from '../entities/meal';
import { Routine } from '../entities/routine';
import { PolarActivity, PolarSleep } from '../entities/polar-data';
import { Workout } from '../entities/workout';

export interface AIPort {
  analyzeFood(imageBase64: string): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>>;
  generateRoutine(params: {
    polarActivities: PolarActivity[];
    polarSleep: PolarSleep[];
    workouts: Workout[];
    goal: string;
    equipment: string[];
    availability: number; // hours per week
    experienceLevel: string;
  }): Promise<Routine>;
}
```

- [ ] **Step 4: Create Storage Port**

```typescript
// src/domain/interfaces/storage-port.ts
import { User, Profile, Connection } from '../entities/user';
import { Workout, PersonalRecord } from '../entities/workout';
import { Meal } from '../entities/meal';
import { PolarActivity, PolarSleep } from '../entities/polar-data';
import { Routine, RoutineLog } from '../entities/routine';

export interface StoragePort {
  // Users
  getUser(id: string): Promise<User | null>;
  getProfile(userId: string): Promise<Profile | null>;
  upsertProfile(profile: Profile): Promise<void>;
  
  // Connections
  getConnection(userId: string, provider: string): Promise<Connection | null>;
  upsertConnection(connection: Connection): Promise<void>;
  
  // Polar
  upsertPolarActivities(activities: PolarActivity[]): Promise<void>;
  upsertPolarSleep(sleep: PolarSleep[]): Promise<void>;
  getPolarActivities(userId: string, startDate: Date, endDate: Date): Promise<PolarActivity[]>;
  getPolarSleep(userId: string, startDate: Date, endDate: Date): Promise<PolarSleep[]>;
  
  // Lyfta
  upsertLyftaWorkouts(workouts: Workout[]): Promise<void>;
  getLyftaWorkouts(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>;
  upsertPersonalRecords(prs: PersonalRecord[]): Promise<void>;
  
  // Meals
  upsertMeal(meal: Meal): Promise<void>;
  getMeals(userId: string, date: Date): Promise<Meal[]>;
  
  // Routines
  saveRoutine(routine: Routine): Promise<void>;
  getRoutines(userId: string): Promise<Routine[]>;
  saveRoutineLog(log: RoutineLog): Promise<void>;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/domain/interfaces/
git commit -m "feat: add domain interfaces (ports)"
```

---

## Task 4: Supabase Setup & Adapter

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `src/infrastructure/storage/supabase-adapter.ts`
- Create: `src/lib/supabase-client.ts`

- [ ] **Step 1: Create database migration**

```sql
-- supabase/migrations/001_initial_schema.sql

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  height NUMERIC,
  weight NUMERIC,
  body_fat NUMERIC,
  target_weight NUMERIC,
  goal TEXT CHECK (goal IN ('lose_weight', 'maintain', 'gain_muscle')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- External connections
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT CHECK (provider IN ('polar', 'lyfta')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Polar activities
CREATE TABLE public.polar_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calories NUMERIC,
  heart_rate_avg NUMERIC,
  heart_rate_max NUMERIC,
  duration NUMERIC,
  sleep_score NUMERIC,
  nightly_recharge NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Polar sleep
CREATE TABLE public.polar_sleep (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sleep_duration NUMERIC,
  sleep_score NUMERIC,
  deep_sleep NUMERIC,
  rem_sleep NUMERIC,
  light_sleep NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Lyfta workouts
CREATE TABLE public.lyfta_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT,
  exercises JSONB,
  duration NUMERIC,
  volume NUMERIC,
  intensity NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records
CREATE TABLE public.lyfta_personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT,
  exercise_name TEXT,
  weight NUMERIC,
  reps NUMERIC,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT,
  name TEXT,
  calories NUMERIC,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  photo_url TEXT,
  analysis_source TEXT CHECK (analysis_source IN ('ai', 'manual')),
  confidence NUMERIC,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routines
CREATE TABLE public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  exercises JSONB,
  goal TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routine logs
CREATE TABLE public.routine_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
  exercise_id TEXT,
  sets NUMERIC,
  reps NUMERIC,
  weight NUMERIC,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polar_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polar_sleep ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyfta_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyfta_personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_logs ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own connections" ON public.connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own connections" ON public.connections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own polar data" ON public.polar_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own polar data" ON public.polar_activities FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own polar sleep" ON public.polar_sleep FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own polar sleep" ON public.polar_sleep FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workouts" ON public.lyfta_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workouts" ON public.lyfta_workouts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own PRs" ON public.lyfta_personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own PRs" ON public.lyfta_personal_records FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own routines" ON public.routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own routines" ON public.routines FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own routine logs" ON public.routine_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own routine logs" ON public.routine_logs FOR ALL USING (auth.uid() = user_id);
```

- [ ] **Step 2: Create Supabase client**

```typescript
// src/lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 3: Create Supabase adapter**

```typescript
// src/infrastructure/storage/supabase-adapter.ts
import { supabase } from '@/lib/supabase-client';
import { StoragePort } from '@/domain/interfaces/storage-port';
import { User, Profile, Connection } from '@/domain/entities/user';
import { Workout, PersonalRecord } from '@/domain/entities/workout';
import { Meal } from '@/domain/entities/meal';
import { PolarActivity, PolarSleep } from '@/domain/entities/polar-data';
import { Routine, RoutineLog } from '@/domain/entities/routine';

export class SupabaseAdapter implements StoragePort {
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email || '',
      createdAt: new Date(data.user.created_at),
    };
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error || !data) return null;
    return {
      userId: data.user_id,
      height: data.height,
      weight: data.weight,
      bodyFat: data.body_fat,
      targetWeight: data.target_weight,
      goal: data.goal,
      experienceLevel: data.experience_level,
    };
  }

  async upsertProfile(profile: Profile): Promise<void> {
    await supabase.from('profiles').upsert({
      user_id: profile.userId,
      height: profile.height,
      weight: profile.weight,
      body_fat: profile.bodyFat,
      target_weight: profile.targetWeight,
      goal: profile.goal,
      experience_level: profile.experienceLevel,
    });
  }

  async getConnection(userId: string, provider: string): Promise<Connection | null> {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single();
    if (error || !data) return null;
    return {
      userId: data.user_id,
      provider: data.provider,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
    };
  }

  async upsertConnection(connection: Connection): Promise<void> {
    await supabase.from('connections').upsert({
      user_id: connection.userId,
      provider: connection.provider,
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken,
      expires_at: connection.expiresAt?.toISOString(),
    });
  }

  async upsertPolarActivities(activities: PolarActivity[]): Promise<void> {
    const { error } = await supabase.from('polar_activities').upsert(
      activities.map((a) => ({
        user_id: a.userId,
        date: a.date.toISOString().split('T')[0],
        calories: a.calories,
        heart_rate_avg: a.heartRateAvg,
        heart_rate_max: a.heartRateMax,
        duration: a.duration,
        sleep_score: a.sleepScore,
        nightly_recharge: a.nightlyRecharge,
      }))
    );
    if (error) throw error;
  }

  async upsertPolarSleep(sleep: PolarSleep[]): Promise<void> {
    const { error } = await supabase.from('polar_sleep').upsert(
      sleep.map((s) => ({
        user_id: s.userId,
        date: s.date.toISOString().split('T')[0],
        sleep_duration: s.sleepDuration,
        sleep_score: s.sleepScore,
        deep_sleep: s.deepSleep,
        rem_sleep: s.remSleep,
        light_sleep: s.lightSleep,
      }))
    );
    if (error) throw error;
  }

  async getPolarActivities(userId: string, startDate: Date, endDate: Date): Promise<PolarActivity[]> {
    const { data, error } = await supabase
      .from('polar_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
    if (error || !data) return [];
    return data.map((a) => ({
      id: a.id,
      userId: a.user_id,
      date: new Date(a.date),
      calories: a.calories,
      heartRateAvg: a.heart_rate_avg,
      heartRateMax: a.heart_rate_max,
      duration: a.duration,
      sleepScore: a.sleep_score,
      nightlyRecharge: a.nightly_recharge,
    }));
  }

  async getPolarSleep(userId: string, startDate: Date, endDate: Date): Promise<PolarSleep[]> {
    const { data, error } = await supabase
      .from('polar_sleep')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
    if (error || !data) return [];
    return data.map((s) => ({
      id: s.id,
      userId: s.user_id,
      date: new Date(s.date),
      sleepDuration: s.sleep_duration,
      sleepScore: s.sleep_score,
      deepSleep: s.deep_sleep,
      remSleep: s.rem_sleep,
      lightSleep: s.light_sleep,
    }));
  }

  async upsertLyftaWorkouts(workouts: Workout[]): Promise<void> {
    const { error } = await supabase.from('lyfta_workouts').upsert(
      workouts.map((w) => ({
        user_id: w.userId,
        date: w.date.toISOString().split('T')[0],
        name: w.name,
        exercises: w.exercises,
        duration: w.duration,
        volume: w.volume,
        intensity: w.intensity,
      }))
    );
    if (error) throw error;
  }

  async getLyftaWorkouts(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('lyfta_workouts')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
    if (error || !data) return [];
    return data.map((w) => ({
      id: w.id,
      userId: w.user_id,
      date: new Date(w.date),
      name: w.name,
      exercises: w.exercises,
      duration: w.duration,
      volume: w.volume,
      intensity: w.intensity,
    }));
  }

  async upsertPersonalRecords(prs: PersonalRecord[]): Promise<void> {
    const { error } = await supabase.from('lyfta_personal_records').upsert(
      prs.map((pr) => ({
        user_id: pr.userId,
        exercise_id: pr.exerciseId,
        exercise_name: pr.exerciseName,
        weight: pr.weight,
        reps: pr.reps,
        date: pr.date.toISOString().split('T')[0],
      }))
    );
    if (error) throw error;
  }

  async upsertMeal(meal: Meal): Promise<void> {
    const { error } = await supabase.from('meals').upsert({
      id: meal.id,
      user_id: meal.userId,
      date: meal.date.toISOString().split('T')[0],
      time: meal.time,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      photo_url: meal.photoUrl,
      analysis_source: meal.analysisSource,
      confidence: meal.confidence,
      description: meal.description,
    });
    if (error) throw error;
  }

  async getMeals(userId: string, date: Date): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date.toISOString().split('T')[0]);
    if (error || !data) return [];
    return data.map((m) => ({
      id: m.id,
      userId: m.user_id,
      date: new Date(m.date),
      time: m.time,
      name: m.name,
      calories: m.calories,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
      photoUrl: m.photo_url,
      analysisSource: m.analysis_source,
      confidence: m.confidence,
      description: m.description,
    }));
  }

  async saveRoutine(routine: Routine): Promise<void> {
    const { error } = await supabase.from('routines').upsert({
      id: routine.id,
      user_id: routine.userId,
      name: routine.name,
      exercises: routine.exercises,
      goal: routine.goal,
      difficulty: routine.difficulty,
      duration_weeks: routine.durationWeeks,
    });
    if (error) throw error;
  }

  async getRoutines(userId: string): Promise<Routine[]> {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      userId: r.user_id,
      name: r.name,
      createdAt: new Date(r.created_at),
      exercises: r.exercises,
      goal: r.goal,
      difficulty: r.difficulty,
      durationWeeks: r.duration_weeks,
    }));
  }

  async saveRoutineLog(log: RoutineLog): Promise<void> {
    const { error } = await supabase.from('routine_logs').upsert({
      id: log.id,
      user_id: log.userId,
      routine_id: log.routineId,
      exercise_id: log.exerciseId,
      sets: log.sets,
      reps: log.reps,
      weight: log.weight,
      completed_at: log.completedAt.toISOString(),
    });
    if (error) throw error;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add supabase/ src/infrastructure/storage/ src/lib/supabase-client.ts
git commit -m "feat: add Supabase setup and storage adapter"
```

---

## Task 5: Polar Adapter

**Files:**
- Create: `src/infrastructure/api/polar-adapter.ts`

- [ ] **Step 1: Create Polar adapter**

```typescript
// src/infrastructure/api/polar-adapter.ts
import { PolarPort } from '@/domain/interfaces/polar-port';
import { PolarActivity, PolarSleep, PolarDailyActivity } from '@/domain/entities/polar-data';

const POLAR_API_BASE = 'https://polaraccesslink.com/v3';
const POLAR_AUTH_BASE = 'https://auth.polar.com';

export class PolarAdapter implements PolarPort {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.POLAR_CLIENT_ID!;
    this.clientSecret = process.env.POLAR_CLIENT_SECRET!;
    this.redirectUri = process.env.POLAR_REDIRECT_URI!;
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'accesslink.read_all',
    });
    return `${POLAR_AUTH_BASE}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }> {
    const response = await fetch(`${POLAR_AUTH_BASE}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    
    // Register user and get user ID
    const userResponse = await fetch(`${POLAR_API_BASE}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'member-id': crypto.randomUUID(),
      }),
    });

    const userData = await userResponse.json();
    
    return {
      accessToken: data.access_token,
      userId: userData['polar-user-id'],
    };
  }

  async getActivities(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarActivity[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `${POLAR_API_BASE}/users/${userId}/activity-samples/${start}/${end}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Polar activities');
    }

    const data = await response.json();
    
    return data.map((activity: any) => ({
      id: crypto.randomUUID(),
      userId,
      date: new Date(activity.date),
      calories: activity.calories,
      heartRateAvg: activity.heart_rate_avg,
      heartRateMax: activity.heart_rate_max,
      duration: activity.duration,
      sleepScore: activity.sleep_score,
      nightlyRecharge: activity.nightly_recharge,
    }));
  }

  async getSleep(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarSleep[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `${POLAR_API_BASE}/users/${userId}/sleep/${start}/${end}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Polar sleep');
    }

    const data = await response.json();
    
    return data.map((sleep: any) => ({
      id: crypto.randomUUID(),
      userId,
      date: new Date(sleep.date),
      sleepDuration: sleep.sleep_duration,
      sleepScore: sleep.sleep_score,
      deepSleep: sleep.deep_sleep,
      remSleep: sleep.rem_sleep,
      lightSleep: sleep.light_sleep,
    }));
  }

  async getDailyActivity(userId: string, accessToken: string, date: Date): Promise<PolarDailyActivity> {
    const dateStr = date.toISOString().split('T')[0];
    
    const response = await fetch(
      `${POLAR_API_BASE}/users/${userId}/activity-log/${dateStr}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Polar daily activity');
    }

    const data = await response.json();
    
    return {
      userId,
      date,
      steps: data.steps,
      calories: data.calories,
      activeMinutes: data.active_minutes,
      heartRateVariability: data.heart_rate_variability,
    };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/infrastructure/api/polar-adapter.ts
git commit -m "feat: add Polar API adapter"
```

---

## Task 6: Lyfta Adapter

**Files:**
- Create: `src/infrastructure/api/lyfta-adapter.ts`

- [ ] **Step 1: Create Lyfta adapter**

```typescript
// src/infrastructure/api/lyfta-adapter.ts
import { LyftaPort } from '@/domain/interfaces/lyfta-port';
import { Workout, PersonalRecord } from '@/domain/entities/workout';
import { Routine } from '@/domain/entities/routine';

const LYFTA_API_BASE = 'https://my.lyfta.app/api/v1';

export class LyftaAdapter implements LyftaPort {
  async getWorkouts(apiKey: string, page: number = 1, limit: number = 50): Promise<Workout[]> {
    const response = await fetch(
      `${LYFTA_API_BASE}/workouts?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Lyfta workouts');
    }

    const data = await response.json();
    
    return data.workouts.map((workout: any) => ({
      id: workout.id.toString(),
      userId: '',
      date: new Date(workout.date),
      name: workout.name,
      exercises: workout.exercises.map((ex: any) => ({
        id: ex.id.toString(),
        name: ex.name,
        sets: ex.sets.map((set: any) => ({
          reps: set.reps,
          weight: set.weight,
          rpe: set.rpe,
          isWarmup: set.is_warmup,
          isDropSet: set.is_drop_set,
        })),
        muscleGroup: ex.muscle_group,
        equipment: ex.equipment,
      })),
      duration: workout.duration,
      volume: workout.volume,
      intensity: workout.intensity,
    }));
  }

  async getExercises(apiKey: string): Promise<{ id: string; name: string; muscleGroup: string }[]> {
    const response = await fetch(`${LYFTA_API_BASE}/exercises`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Lyfta exercises');
    }

    const data = await response.json();
    
    return data.exercises.map((ex: any) => ({
      id: ex.id.toString(),
      name: ex.name,
      muscleGroup: ex.muscle_group,
    }));
  }

  async pushRoutine(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }> {
    const response = await fetch(`${LYFTA_API_BASE}/templates`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: {
          name: routine.name,
          exercises: routine.exercises.map((ex) => ({
            exercise_id: ex.exerciseId,
            name: ex.exerciseName,
            sets: Array(ex.sets).fill({
              reps: parseInt(ex.reps) || 8,
              weight: ex.weight || 0,
              rest_seconds: ex.restSeconds,
            }),
          })),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to push routine to Lyfta');
    }

    const data = await response.json();
    
    return {
      success: true,
      templateId: data.template_id?.toString(),
    };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/infrastructure/api/lyfta-adapter.ts
git commit -m "feat: add Lyfta API adapter"
```

---

## Task 7: AI Adapters (OpenAI + Claude)

**Files:**
- Create: `src/infrastructure/ai/openai-adapter.ts`
- Create: `src/infrastructure/ai/claude-adapter.ts`

- [ ] **Step 1: Create OpenAI adapter for food analysis**

```typescript
// src/infrastructure/ai/openai-adapter.ts
import OpenAI from 'openai';
import { Meal } from '@/domain/entities/meal';

export class OpenAIAdapter {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeFood(imageBase64: string): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this food photo and provide:
1. Description of the food
2. Estimated calories
3. Protein in grams
4. Carbohydrates in grams
5. Fat in grams
6. Confidence level (0-100)

Respond in JSON format:
{
  "description": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": number
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);

    return {
      name: result.description || 'Unknown food',
      calories: result.calories || 0,
      protein: result.protein || 0,
      carbs: result.carbs || 0,
      fat: result.fat || 0,
      analysisSource: 'ai',
      confidence: result.confidence || 0,
      description: result.description,
    };
  }
}
```

- [ ] **Step 2: Create Claude adapter for routine generation**

```typescript
// src/infrastructure/ai/claude-adapter.ts
import Anthropic from '@anthropic-ai/sdk';
import { Routine, RoutineExercise } from '@/domain/entities/routine';
import { PolarActivity, PolarSleep } from '@/domain/entities/polar-data';
import { Workout } from '@/domain/entities/workout';

export class ClaudeAdapter {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateRoutine(params: {
    polarActivities: PolarActivity[];
    polarSleep: PolarSleep[];
    workouts: Workout[];
    goal: string;
    equipment: string[];
    availability: number;
    experienceLevel: string;
  }): Promise<Routine> {
    const prompt = this.buildPrompt(params);
    
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0]?.type === 'text' ? response.content[0].text : '{}';
    const result = JSON.parse(content);

    return {
      id: crypto.randomUUID(),
      userId: '',
      name: result.name || 'Generated Routine',
      createdAt: new Date(),
      exercises: result.exercises || [],
      goal: params.goal,
      difficulty: params.experienceLevel as 'beginner' | 'intermediate' | 'advanced',
      durationWeeks: result.durationWeeks || 4,
    };
  }

  private buildPrompt(params: {
    polarActivities: PolarActivity[];
    polarSleep: PolarSleep[];
    workouts: Workout[];
    goal: string;
    equipment: string[];
    availability: number;
    experienceLevel: string;
  }): string {
    const recentActivities = params.polarActivities.slice(-7);
    const recentSleep = params.polarSleep.slice(-7);
    const recentWorkouts = params.workouts.slice(-10);

    return `You are an expert fitness trainer. Generate a personalized workout routine based on this data:

USER PROFILE:
- Goal: ${params.goal}
- Experience: ${params.experienceLevel}
- Available equipment: ${params.equipment.join(', ')}
- Hours per week available: ${params.availability}

RECENT POLAR DATA (last 7 days):
${recentActivities.map(a => `- ${a.date.toISOString().split('T')[0]}: ${a.calories} cal, HR avg ${a.heartRateAvg}, ${a.duration}min`).join('\n')}

RECENT SLEEP (last 7 days):
${recentSleep.map(s => `- ${s.date.toISOString().split('T')[0]}: ${s.sleepDuration}min, score ${s.sleepScore}`).join('\n')}

RECENT WORKOUTS:
${recentWorkouts.map(w => `- ${w.date.toISOString().split('T')[0]}: ${w.name}, ${w.exercises.length} exercises, ${w.duration}min`).join('\n')}

Generate a JSON routine with this exact structure:
{
  "name": "Routine Name",
  "durationWeeks": 4,
  "exercises": [
    {
      "exerciseId": "unique-id",
      "exerciseName": "Exercise Name",
      "sets": 4,
      "reps": "8-12",
      "weight": null,
      "restSeconds": 90,
      "notes": "optional notes"
    }
  ]
}

Focus on progressive overload and consider recent sleep/recovery data.`;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/infrastructure/ai/
git commit -m "feat: add AI adapters for food analysis and routine generation"
```

---

## Task 8: Use Cases

**Files:**
- Create: `src/application/usecases/sync-polar.ts`
- Create: `src/application/usecases/sync-lyfta.ts`
- Create: `src/application/usecases/analyze-meal.ts`
- Create: `src/application/usecases/generate-routine.ts`
- Create: `src/application/usecases/push-routine.ts`

- [ ] **Step 1: Create Sync Polar use case**

```typescript
// src/application/usecases/sync-polar.ts
import { PolarPort } from '@/domain/interfaces/polar-port';
import { StoragePort } from '@/domain/interfaces/storage-port';

export class SyncPolarUseCase {
  constructor(
    private polarPort: PolarPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<void> {
    const activities = await this.polarPort.getActivities(userId, accessToken, startDate, endDate);
    await this.storagePort.upsertPolarActivities(activities);

    const sleep = await this.polarPort.getSleep(userId, accessToken, startDate, endDate);
    await this.storagePort.upsertPolarSleep(sleep);
  }
}
```

- [ ] **Step 2: Create Sync Lyfta use case**

```typescript
// src/application/usecases/sync-lyfta.ts
import { LyftaPort } from '@/domain/interfaces/lyfta-port';
import { StoragePort } from '@/domain/interfaces/storage-port';

export class SyncLyftaUseCase {
  constructor(
    private lyftaPort: LyftaPort,
    private storagePort: StoragePort
  ) {}

  async execute(apiKey: string, userId: string): Promise<void> {
    const workouts = await this.lyftaPort.getWorkouts(apiKey);
    const workoutsWithUser = workouts.map(w => ({ ...w, userId }));
    await this.storagePort.upsertLyftaWorkouts(workoutsWithUser);
  }
}
```

- [ ] **Step 3: Create Analyze Meal use case**

```typescript
// src/application/usecases/analyze-meal.ts
import { AIPort } from '@/domain/interfaces/ai-port';
import { StoragePort } from '@/domain/interfaces/storage-port';
import { Meal } from '@/domain/entities/meal';

export class AnalyzeMealUseCase {
  constructor(
    private aiPort: AIPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, imageBase64: string, date: Date, time: string): Promise<Meal> {
    const analysis = await this.aiPort.analyzeFood(imageBase64);
    
    const meal: Meal = {
      id: crypto.randomUUID(),
      userId,
      date,
      time,
      ...analysis,
    };

    await this.storagePort.upsertMeal(meal);
    return meal;
  }
}
```

- [ ] **Step 4: Create Generate Routine use case**

```typescript
// src/application/usecases/generate-routine.ts
import { AIPort } from '@/domain/interfaces/ai-port';
import { StoragePort } from '@/domain/interfaces/storage-port';
import { Routine } from '@/domain/entities/routine';

export class GenerateRoutineUseCase {
  constructor(
    private aiPort: AIPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, params: {
    goal: string;
    equipment: string[];
    availability: number;
    experienceLevel: string;
  }): Promise<Routine> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const polarActivities = await this.storagePort.getPolarActivities(userId, startDate, endDate);
    const polarSleep = await this.storagePort.getPolarSleep(userId, startDate, endDate);
    const workouts = await this.storagePort.getLyftaWorkouts(userId, startDate, endDate);

    const routine = await this.aiPort.generateRoutine({
      polarActivities,
      polarSleep,
      workouts,
      ...params,
    });

    routine.userId = userId;
    await this.storagePort.saveRoutine(routine);
    return routine;
  }
}
```

- [ ] **Step 5: Create Push Routine use case**

```typescript
// src/application/usecases/push-routine.ts
import { LyftaPort } from '@/domain/interfaces/lyfta-port';
import { Routine } from '@/domain/entities/routine';

export class PushRoutineUseCase {
  constructor(private lyftaPort: LyftaPort) {}

  async execute(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }> {
    return this.lyftaPort.pushRoutine(apiKey, routine);
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/application/usecases/
git commit -m "feat: add application use cases"
```

---

## Task 9: API Routes

**Files:**
- Create: `src/app/api/polar/authorize/route.ts`
- Create: `src/app/api/polar/callback/route.ts`
- Create: `src/app/api/polar/sync/route.ts`
- Create: `src/app/api/lyfta/sync/route.ts`
- Create: `src/app/api/nutrition/analyze/route.ts`
- Create: `src/app/api/routines/generate/route.ts`
- Create: `src/app/api/routines/push/route.ts`

- [ ] **Step 1: Create Polar authorize route**

```typescript
// src/app/api/polar/authorize/route.ts
import { NextResponse } from 'next/server';
import { PolarAdapter } from '@/infrastructure/api/polar-adapter';

export async function GET() {
  const polar = new PolarAdapter();
  const authUrl = polar.getAuthorizationUrl();
  return NextResponse.redirect(authUrl);
}
```

- [ ] **Step 2: Create Polar callback route**

```typescript
// src/app/api/polar/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PolarAdapter } from '@/infrastructure/api/polar-adapter';
import { SupabaseAdapter } from '@/infrastructure/storage/supabase-adapter';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', request.url));
  }

  try {
    const polar = new PolarAdapter();
    const { accessToken, userId } = await polar.exchangeCodeForToken(code);

    const storage = new SupabaseAdapter();
    await storage.upsertConnection({
      userId,
      provider: 'polar',
      accessToken,
    });

    return NextResponse.redirect(new URL('/settings?success=polar_connected', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/settings?error=polar_auth_failed', request.url));
  }
}
```

- [ ] **Step 3: Create Polar sync route**

```typescript
// src/app/api/polar/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PolarAdapter } from '@/infrastructure/api/polar-adapter';
import { SupabaseAdapter } from '@/infrastructure/storage/supabase-adapter';
import { SyncPolarUseCase } from '@/application/usecases/sync-polar';

export async function POST(request: NextRequest) {
  const { userId, startDate, endDate } = await request.json();

  try {
    const storage = new SupabaseAdapter();
    const connection = await storage.getConnection(userId, 'polar');

    if (!connection) {
      return NextResponse.json({ error: 'Polar not connected' }, { status: 400 });
    }

    const polar = new PolarAdapter();
    const syncPolar = new SyncPolarUseCase(polar, storage);

    await syncPolar.execute(
      userId,
      connection.accessToken,
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create Lyfta sync route**

```typescript
// src/app/api/lyfta/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LyftaAdapter } from '@/infrastructure/api/lyfta-adapter';
import { SupabaseAdapter } from '@/infrastructure/storage/supabase-adapter';
import { SyncLyftaUseCase } from '@/application/usecases/sync-lyfta';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  try {
    const storage = new SupabaseAdapter();
    const apiKey = process.env.LYFTA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Lyfta API key not configured' }, { status: 400 });
    }

    const lyfta = new LyftaAdapter();
    const syncLyfta = new SyncLyftaUseCase(lyfta, storage);

    await syncLyfta.execute(apiKey, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
```

- [ ] **Step 5: Create Nutrition analyze route**

```typescript
// src/app/api/nutrition/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAIAdapter } from '@/infrastructure/ai/openai-adapter';
import { SupabaseAdapter } from '@/infrastructure/storage/supabase-adapter';
import { AnalyzeMealUseCase } from '@/application/usecases/analyze-meal';

export async function POST(request: NextRequest) {
  const { userId, imageBase64, date, time } = await request.json();

  try {
    const openai = new OpenAIAdapter();
    const storage = new SupabaseAdapter();
    const analyzeMeal = new AnalyzeMealUseCase(openai, storage);

    const meal = await analyzeMeal.execute(userId, imageBase64, new Date(date), time);

    return NextResponse.json({ success: true, meal });
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
```

- [ ] **Step 6: Create Routines generate route**

```typescript
// src/app/api/routines/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAdapter } from '@/infrastructure/ai/claude-adapter';
import { SupabaseAdapter } from '@/infrastructure/storage/supabase-adapter';
import { GenerateRoutineUseCase } from '@/application/usecases/generate-routine';

export async function POST(request: NextRequest) {
  const { userId, goal, equipment, availability, experienceLevel } = await request.json();

  try {
    const claude = new ClaudeAdapter();
    const storage = new SupabaseAdapter();
    const generateRoutine = new GenerateRoutineUseCase(claude, storage);

    const routine = await generateRoutine.execute(userId, {
      goal,
      equipment,
      availability,
      experienceLevel,
    });

    return NextResponse.json({ success: true, routine });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
```

- [ ] **Step 7: Create Routines push route**

```typescript
// src/app/api/routines/push/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LyftaAdapter } from '@/infrastructure/api/lyfta-adapter';
import { PushRoutineUseCase } from '@/application/usecases/push-routine';

export async function POST(request: NextRequest) {
  const { apiKey, routine } = await request.json();

  try {
    const lyfta = new LyftaAdapter();
    const pushRoutine = new PushRoutineUseCase(lyfta);

    const result = await pushRoutine.execute(apiKey, routine);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: 'Push failed' }, { status: 500 });
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/api/
git commit -m "feat: add API routes for all integrations"
```

---

## Task 10: UI Components

**Files:**
- Create: `src/ui/components/dashboard/metrics-card.tsx`
- Create: `src/ui/components/dashboard/polar-widget.tsx`
- Create: `src/ui/components/dashboard/lyfta-widget.tsx`
- Create: `src/ui/components/dashboard/calendar-widget.tsx`
- Create: `src/ui/components/routines/chat-interface.tsx`
- Create: `src/ui/components/meals/photo-upload.tsx`

- [ ] **Step 1: Create Metrics Card component**

```typescript
// src/ui/components/dashboard/metrics-card.tsx
interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function MetricsCard({ title, value, subtitle, color = '#22c55e' }: MetricsCardProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg text-center">
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-sm text-slate-400">{title}</div>
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create Polar Widget component**

```typescript
// src/ui/components/dashboard/polar-widget.tsx
'use client';

import { useEffect, useState } from 'react';

interface PolarData {
  nightlyRecharge: number;
  hrv: number;
  steps: number;
}

export function PolarWidget() {
  const [data, setData] = useState<PolarData | null>(null);

  useEffect(() => {
    // Fetch Polar data from API
    fetch('/api/polar/today')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="bg-slate-800 p-4 rounded-lg">Loading Polar data...</div>;

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">POLAR - ACTIVIDAD 24/7</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-xs text-slate-400">Nightly Recharge</div>
          <div className="text-lg font-bold text-green-500">{data.nightlyRecharge}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">HRV (ms)</div>
          <div className="text-lg font-bold text-blue-500">{data.hrv}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Pasos</div>
          <div className="text-lg font-bold text-yellow-500">{data.steps.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Lyfta Widget component**

```typescript
// src/ui/components/dashboard/lyfta-widget.tsx
'use client';

import { useEffect, useState } from 'react';

interface Workout {
  name: string;
  date: string;
  duration: number;
  volume: number;
  exercises: number;
  prs: number;
}

export function LyftaWidget() {
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    fetch('/api/lyfta/last-workout')
      .then(res => res.json())
      .then(setWorkout);
  }, []);

  if (!workout) return <div className="bg-slate-800 p-4 rounded-lg">Loading Lyfta data...</div>;

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">LYFTA - ÚLTIMO ENTRENAMIENTO</h3>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold">{workout.name}</div>
          <div className="text-sm text-slate-400 mt-1">
            ⏱️ {workout.duration} min • 🏋️ {workout.volume.toLocaleString()} kg vol. • 📊 {workout.exercises} ejercicios
          </div>
        </div>
        {workout.prs > 0 && (
          <span className="text-green-500 text-sm">🏆 {workout.prs} PRs</span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Calendar Widget component**

```typescript
// src/ui/components/dashboard/calendar-widget.tsx
'use client';

interface CalendarWidgetProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarWidget({ selectedDate, onDateSelect }: CalendarWidgetProps) {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - today.getDay() + i);
    return date;
  });

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">HISTORIAL - ÚLTIMOS 7 DÍAS</h3>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <button
              key={i}
              onClick={() => onDateSelect(date)}
              className={`p-2 rounded text-center text-xs ${
                isSelected 
                  ? 'bg-blue-600 text-white' 
                  : isToday 
                    ? 'bg-slate-700 text-slate-200' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <div>{days[date.getDay()]}</div>
              <div className="font-bold mt-1">{date.getDate()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create Chat Interface component**

```typescript
// src/ui/components/routines/chat-interface.tsx
'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/routines/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-green-600/20 ml-8'
                : 'bg-slate-800 mr-8'
            }`}
          >
            <div className={`text-xs font-medium mb-1 ${
              msg.role === 'user' ? 'text-green-500' : 'text-blue-500'
            }`}>
              {msg.role === 'user' ? 'Tú' : 'Entrenador IA'}
            </div>
            <div className="text-sm">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-slate-800 p-3 rounded-lg mr-8">
            <div className="text-xs text-blue-500 mb-1">Entrenador IA</div>
            <div className="text-sm animate-pulse">Pensando...</div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe qué rutina quieres..."
            className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 6: Create Photo Upload component**

```typescript
// src/ui/components/meals/photo-upload.tsx
'use client';

import { useState, useRef } from 'react';

interface AnalysisResult {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export function PhotoUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    try {
      const base64 = reader.result?.toString().split(',')[1];
      const response = await fetch('/api/nutrition/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          date: new Date().toISOString(),
          time: new Date().toLocaleTimeString(),
        }),
      });

      const data = await response.json();
      setResult(data.meal);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
      >
        {preview ? (
          <img src={preview} alt="Food" className="max-h-64 mx-auto rounded-lg" />
        ) : (
          <>
            <div className="text-4xl mb-2">📸</div>
            <div className="text-slate-400">Arrastra una foto o haz click para seleccionar</div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {isAnalyzing && (
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="animate-pulse text-slate-400">Analizando comida...</div>
        </div>
      )}

      {result && (
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-green-500 font-medium mb-2">Resultado IA</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>🔥 Calorías: <strong>{result.calories} kcal</strong></div>
            <div>🥩 Proteína: <strong>{result.protein}g</strong></div>
            <div>🍞 Carbohidratos: <strong>{result.carbs}g</strong></div>
            <div>🧈 Grasa: <strong>{result.fat}g</strong></div>
          </div>
          <div className="text-xs text-slate-500 mt-3">
            Confianza: {result.confidence}% • {result.description}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/ui/components/
git commit -m "feat: add UI components for dashboard, routines, and meals"
```

---

## Task 11: Pages

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/app/routines/page.tsx`
- Create: `src/app/meals/page.tsx`
- Create: `src/app/stats/page.tsx`
- Create: `src/app/settings/page.tsx`

- [ ] **Step 1: Create Dashboard page**

```typescript
// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MetricsCard } from '@/ui/components/dashboard/metrics-card';
import { PolarWidget } from '@/ui/components/dashboard/polar-widget';
import { LyftaWidget } from '@/ui/components/dashboard/lyfta-widget';
import { CalendarWidget } from '@/ui/components/dashboard/calendar-widget';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [syncing, setSyncing] = useState({ polar: false, lyfta: false });

  const handleSync = async (provider: 'polar' | 'lyfta') => {
    setSyncing(prev => ({ ...prev, [provider]: true }));
    try {
      await fetch(`/api/${provider}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user' }),
      });
    } finally {
      setSyncing(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleSync('polar')}
              disabled={syncing.polar}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
            >
              {syncing.polar ? '⏳' : '🔄'} Sincronizar Polar
            </button>
            <button
              onClick={() => handleSync('lyfta')}
              disabled={syncing.lyfta}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
            >
              {syncing.lyfta ? '⏳' : '🔄'} Sincronizar Lyfta
            </button>
          </div>
        </div>

        <CalendarWidget
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <div className="grid grid-cols-4 gap-4 mt-6">
          <MetricsCard title="Calorías objetivo" value="1,850" subtitle="Consumidas: 1,420" color="#22c55e" />
          <MetricsCard title="Calorías quemadas" value="650" subtitle="Ejercicio: 420" color="#3b82f6" />
          <MetricsCard title="Sueño" value="7.5h" subtitle="Score: 82/100" color="#f59e0b" />
          <MetricsCard title="HR Promedio" value="68" subtitle="Max: 145 bpm" color="#ec4899" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <PolarWidget />
          <LyftaWidget />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Routines page**

```typescript
// src/app/routines/page.tsx
'use client';

import { ChatInterface } from '@/ui/components/routines/chat-interface';

export default function RoutinesPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-2xl font-bold">Generador de Rutinas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Habla con tu entrenador IA para crear rutinas personalizadas
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Meals page**

```typescript
// src/app/meals/page.tsx
'use client';

import { PhotoUpload } from '@/ui/components/meals/photo-upload';

export default function MealsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Análisis de Comidas</h1>
        <PhotoUpload />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Stats page**

```typescript
// src/app/stats/page.tsx
'use client';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-3">PROGRESO - ÚLTIMO MES</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Peso</span>
                  <span className="text-green-500">-2.3 kg ↓</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Volumen semanal</span>
                  <span className="text-blue-500">+12% ↑</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calorías promedio</span>
                  <span className="text-yellow-500">1,750/día</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-3">DISTRIBUCIÓN MACROS</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-500">42g</div>
                <div className="text-xs text-slate-400">Proteína</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">38g</div>
                <div className="text-xs text-slate-400">Carbohidratos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">18g</div>
                <div className="text-xs text-slate-400">Grasa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create Settings page**

```typescript
// src/app/settings/page.tsx
'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [polarConnected, setPolarConnected] = useState(false);
  const [lyftaApiKey, setLyftaApiKey] = useState('');

  const handleConnectPolar = () => {
    window.location.href = '/api/polar/authorize';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>
        
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Conexión Polar</h3>
            <p className="text-sm text-slate-400 mb-3">
              Conecta tu reloj Polar para sincronizar actividad y sueño
            </p>
            <button
              onClick={handleConnectPolar}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
            >
              {polarConnected ? '✅ Conectado' : '🔗 Conectar Polar'}
            </button>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">API Key de Lyfta</h3>
            <p className="text-sm text-slate-400 mb-3">
              Ingresa tu API key de Lyfta para sincronizar entrenamientos
            </p>
            <input
              type="password"
              value={lyftaApiKey}
              onChange={(e) => setLyftaApiKey(e.target.value)}
              placeholder="Tu API key de Lyfta"
              className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mb-3"
            />
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm">
              Guardar
            </button>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Perfil</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Altura (cm)</label>
                <input type="number" className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Peso (kg)</label>
                <input type="number" className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Objetivo</label>
                <select className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1">
                  <option value="lose_weight">Perder peso</option>
                  <option value="maintain">Mantener</option>
                  <option value="gain_muscle">Ganar músculo</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Experiencia</label>
                <select className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1">
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/
git commit -m "feat: add all pages (dashboard, routines, meals, stats, settings)"
```

---

## Task 12: Navigation & Layout

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/ui/components/shared/navigation.tsx`

- [ ] **Step 1: Create Navigation component**

```typescript
// src/ui/components/shared/navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/routines', label: 'Rutinas' },
  { href: '/meals', label: 'Comidas' },
  { href: '/stats', label: 'Stats' },
  { href: '/settings', label: 'Settings' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link href="/dashboard" className="font-bold text-lg">
            TrainerCalAI
          </Link>
          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Update layout**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/ui/components/shared/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrainerCalAI',
  description: 'AI-powered fitness tracking and routine generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/ui/components/shared/navigation.tsx
git commit -m "feat: add navigation and layout"
```

---

## Task 13: Final Testing & Polish

- [ ] **Step 1: Run development server**

```bash
npm run dev
```

- [ ] **Step 2: Test all pages render**

Navigate to each page and verify they load without errors:
- http://localhost:3000/dashboard
- http://localhost:3000/routines
- http://localhost:3000/meals
- http://localhost:3000/stats
- http://localhost:3000/settings

- [ ] **Step 3: Run TypeScript check**

```bash
npm run typecheck
```

- [ ] **Step 4: Run linter**

```bash
npm run lint
```

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: final testing and polish"
```

---

## Summary

This plan implements a complete personal fitness application with:

1. **Hexagonal architecture** - Clean separation of concerns
2. **Polar integration** - OAuth2 sync for activity and sleep data
3. **Lyfta integration** - API sync for workouts and routine push
4. **AI food analysis** - GPT-4 Vision for calorie/macro estimation
5. **AI routine generation** - Claude for personalized workout plans
6. **Unified dashboard** - View all data in one place
7. **Dark minimalist UI** - Tailwind + shadcn/ui

**Total tasks:** 13
**Estimated time:** 5-7 days for experienced developer