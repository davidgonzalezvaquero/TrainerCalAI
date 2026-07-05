# Frontend Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all frontend bugs, wire date selection to API calls, add Zustand state management, and make every page functional with real data.

**Architecture:** Fix & Wire approach — fix bugs in existing components, add Zustand store for shared state, create new API routes for date-specific data, wire all pages to real data. No full rewrite.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand (already installed)

---

## File Structure

### New Files
- `src/lib/constants.ts` — DEV_USER_ID constant
- `src/stores/dashboard-store.ts` — Zustand store for selectedDate, refreshKey
- `src/app/api/polar/date/route.ts` — GET data for specific date
- `src/app/api/lyfta/date/route.ts` — GET workout for specific date
- `src/app/api/polar/status/route.ts` — GET connection status
- `src/app/api/settings/profile/route.ts` — POST save user profile
- `src/app/api/settings/lyfta-key/route.ts` — POST save Lyfta API key
- `src/app/api/stats/route.ts` — GET aggregated stats
- `src/app/api/routines/chat/route.ts` — POST chat message → generate routine

### Modified Files
- `src/app/page.tsx` — redirect to /dashboard
- `src/app/dashboard/page.tsx` — use Zustand, wire data fetching
- `src/app/settings/page.tsx` — wire connection status, save profile
- `src/app/stats/page.tsx` — wire to real data
- `src/ui/components/shared/navigation.tsx` — Spanish labels
- `src/ui/components/dashboard/calendar-widget.tsx` — fix labels, add week nav
- `src/ui/components/dashboard/polar-widget.tsx` — accept date prop, error handling
- `src/ui/components/dashboard/lyfta-widget.tsx` — accept date prop, show name/volume
- `src/ui/components/meals/photo-upload.tsx` — fix race condition, add userId
- `src/ui/components/routines/chat-interface.tsx` — fix API route, add error handling

---

### Task 1: Shared Infrastructure

**Files:**
- Create: `src/lib/constants.ts`
- Create: `src/stores/dashboard-store.ts`

- [ ] **Step 1: Create constants file**

```typescript
// src/lib/constants.ts
export const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';
```

- [ ] **Step 2: Create Zustand store**

```typescript
// src/stores/dashboard-store.ts
import { create } from 'zustand';

interface DashboardState {
  selectedDate: Date;
  refreshKey: number;
  setSelectedDate: (date: Date) => void;
  incrementRefresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedDate: new Date(),
  refreshKey: 0,
  setSelectedDate: (date) => set({ selectedDate: date }),
  incrementRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts src/stores/dashboard-store.ts
git commit -m "feat: Add shared constants and Zustand dashboard store"
```

---

### Task 2: Root Redirect + Navigation Labels

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/ui/components/shared/navigation.tsx`

- [ ] **Step 1: Replace root page with redirect**

```typescript
// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
```

- [ ] **Step 2: Update navigation labels to Spanish**

```typescript
// src/ui/components/shared/navigation.tsx
const navItems = [
  { href: '/dashboard', label: 'Panel' },
  { href: '/routines', label: 'Rutinas' },
  { href: '/meals', label: 'Comidas' },
  { href: '/stats', label: 'Estadísticas' },
  { href: '/settings', label: 'Configuración' },
];
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/ui/components/shared/navigation.tsx
git commit -m "fix: Redirect root to dashboard, Spanish nav labels"
```

---

### Task 3: Calendar Widget Fix + Week Navigation

**Files:**
- Modify: `src/ui/components/dashboard/calendar-widget.tsx`

- [ ] **Step 1: Fix day labels and add week navigation**

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
  
  // Calculate Monday of the week containing selectedDate
  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };

  const [weekStart, setWeekStart] = React.useState(getMonday(selectedDate));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
  });

  const goToPrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const goToThisWeek = () => {
    setWeekStart(getMonday(today));
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400">HISTORIAL - ÚLTIMOS 7 DÍAS</h3>
        <div className="flex gap-1">
          <button onClick={goToPrevWeek} className="px-2 py-1 text-slate-400 hover:text-white text-xs">←</button>
          <button onClick={goToThisWeek} className="px-2 py-1 text-slate-400 hover:text-white text-xs">Hoy</button>
          <button onClick={goToNextWeek} className="px-2 py-1 text-slate-400 hover:text-white text-xs">→</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <button
              key={i}
              onClick={() => onDateSelect(date)}
              className={`p-2 rounded text-center text-xs transition-colors ${
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

Note: Add `import React from 'react';` at the top.

- [ ] **Step 2: Commit**

```bash
git add src/ui/components/dashboard/calendar-widget.tsx
git commit -m "fix: Calendar day labels, add week navigation"
```

---

### Task 4: Polar Date API Route

**Files:**
- Create: `src/app/api/polar/date/route.ts`

- [ ] **Step 1: Create date-specific Polar API route**

```typescript
// src/app/api/polar/date/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

export async function GET(request: NextRequest) {
  const dateStr = request.nextUrl.searchParams.get('date');
  
  try {
    const storage = new SupabaseAdapter();
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const date = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const activities = await storage.getPolarActivities(userId, start, end);
    const sleep = await storage.getPolarSleep(userId, start, end);

    const activity = activities[0];
    const sleepData = sleep[0];

    return NextResponse.json({
      calories: activity?.calories ?? 0,
      duration: activity?.duration ?? 0,
      heartRateAvg: activity?.heartRateAvg ?? 0,
      heartRateMax: activity?.heartRateMax ?? 0,
      nightlyRecharge: activity?.nightlyRecharge ?? 0,
      sleepScore: sleepData?.sleepScore ?? 0,
      sleepDuration: sleepData?.sleepDuration ?? 0,
      deepSleep: sleepData?.deepSleep ?? 0,
      remSleep: sleepData?.remSleep ?? 0,
      lightSleep: sleepData?.lightSleep ?? 0,
    });
  } catch {
    return NextResponse.json({
      calories: 0, duration: 0, heartRateAvg: 0, heartRateMax: 0,
      nightlyRecharge: 0, sleepScore: 0, sleepDuration: 0,
      deepSleep: 0, remSleep: 0, lightSleep: 0,
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/polar/date/route.ts
git commit -m "feat: Add Polar date-specific API route"
```

---

### Task 5: Lyfta Date API Route

**Files:**
- Create: `src/app/api/lyfta/date/route.ts`

- [ ] **Step 1: Create date-specific Lyfta API route**

```typescript
// src/app/api/lyfta/date/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

export async function GET(request: NextRequest) {
  const dateStr = request.nextUrl.searchParams.get('date');
  
  try {
    const storage = new SupabaseAdapter();
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const date = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const workouts = await storage.getLyftaWorkouts(userId, start, end);
    const workout = workouts[0];

    if (!workout) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      name: workout.name,
      date: workout.date.toISOString(),
      duration: workout.duration,
      volume: workout.volume,
      exercises: workout.exercises.length,
    });
  } catch {
    return NextResponse.json(null);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/lyfta/date/route.ts
git commit -m "feat: Add Lyfta date-specific API route"
```

---

### Task 6: Polar Widget Fix

**Files:**
- Modify: `src/ui/components/dashboard/polar-widget.tsx`

- [ ] **Step 1: Rewrite Polar widget with date prop and error handling**

```typescript
// src/ui/components/dashboard/polar-widget.tsx
'use client';

import { useEffect, useState } from 'react';

interface PolarData {
  calories: number;
  duration: number;
  heartRateAvg: number;
  heartRateMax: number;
  nightlyRecharge: number;
  sleepScore: number;
  sleepDuration: number;
}

interface PolarWidgetProps {
  date: Date;
  refreshKey: number;
}

export function PolarWidget({ date, refreshKey }: PolarWidgetProps) {
  const [data, setData] = useState<PolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dateStr = date.toISOString().split('T')[0];
    setLoading(true);
    setError(false);
    
    fetch(`/api/polar/date?date=${dateStr}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [date, refreshKey]);

  if (loading) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-slate-400">Cargando datos Polar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-red-400">Error al cargar datos Polar</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">POLAR - ACTIVIDAD</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-xs text-slate-400">Calorías</div>
          <div className="text-lg font-bold text-green-500">
            {data?.calories ? data.calories.toLocaleString() : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Actividad (min)</div>
          <div className="text-lg font-bold text-blue-500">
            {data?.duration ? Math.round(data.duration / 60) : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Sueño (h)</div>
          <div className="text-lg font-bold text-yellow-500">
            {data?.sleepDuration ? (data.sleepDuration / 3600).toFixed(1) : '-'}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div>
          <div className="text-xs text-slate-400">Recharge Nocturna</div>
          <div className="text-lg font-bold text-green-500">
            {data?.nightlyRecharge ? `${data.nightlyRecharge}%` : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">FC Promedio</div>
          <div className="text-lg font-bold text-blue-500">
            {data?.heartRateAvg ? data.heartRateAvg : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Score Sueño</div>
          <div className="text-lg font-bold text-yellow-500">
            {data?.sleepScore ? data.sleepScore : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/components/dashboard/polar-widget.tsx
git commit -m "fix: Polar widget with date prop, error handling, real data"
```

---

### Task 7: Lyfta Widget Fix

**Files:**
- Modify: `src/ui/components/dashboard/lyfta-widget.tsx`

- [ ] **Step 1: Rewrite Lyfta widget with date prop**

```typescript
// src/ui/components/dashboard/lyfta-widget.tsx
'use client';

import { useEffect, useState } from 'react';

interface Workout {
  name: string | null;
  date: string;
  duration: number | null;
  volume: number | null;
  exercises: number;
}

interface LyftaWidgetProps {
  date: Date;
  refreshKey: number;
}

export function LyftaWidget({ date, refreshKey }: LyftaWidgetProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dateStr = date.toISOString().split('T')[0];
    setLoading(true);
    setError(false);
    
    fetch(`/api/lyfta/date?date=${dateStr}`)
      .then(res => res.json())
      .then(setWorkout)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [date, refreshKey]);

  if (loading) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-slate-400">Cargando datos Lyfta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-red-400">Error al cargar datos Lyfta</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">LYFTA - ENTRENAMIENTO</h3>
      {workout ? (
        <div className="space-y-2">
          <div className="text-lg font-bold text-purple-400">
            {workout.name || 'Entrenamiento'}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-400">Duración: </span>
              <span className="text-white">{workout.duration ? `${Math.round(workout.duration / 60)} min` : '-'}</span>
            </div>
            <div>
              <span className="text-slate-400">Volumen: </span>
              <span className="text-white">{workout.volume ? `${workout.volume} kg` : '-'}</span>
            </div>
            <div>
              <span className="text-slate-400">Ejercicios: </span>
              <span className="text-white">{workout.exercises}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400">Sin entrenamiento este día</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/components/dashboard/lyfta-widget.tsx
git commit -m "fix: Lyfta widget with date prop, show name/duration/volume"
```

---

### Task 8: Dashboard Wiring

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Rewrite dashboard to use Zustand store and wire everything**

```typescript
// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { DEV_USER_ID } from '@/lib/constants';
import { MetricsCard } from '@/ui/components/dashboard/metrics-card';
import { PolarWidget } from '@/ui/components/dashboard/polar-widget';
import { LyftaWidget } from '@/ui/components/dashboard/lyfta-widget';
import { CalendarWidget } from '@/ui/components/dashboard/calendar-widget';

interface DayData {
  calories: number;
  duration: number;
  sleepDuration: number;
  workouts: number;
}

export default function DashboardPage() {
  const { selectedDate, setSelectedDate, refreshKey, incrementRefresh } = useDashboardStore();
  const [syncing, setSyncing] = useState({ polar: false, lyfta: false });
  const [dayData, setDayData] = useState<DayData>({ calories: 0, duration: 0, sleepDuration: 0, workouts: 0 });

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    Promise.all([
      fetch(`/api/polar/date?date=${dateStr}`).then(r => r.json()),
      fetch(`/api/lyfta/date?date=${dateStr}`).then(r => r.json()),
    ]).then(([polar, lyfta]) => {
      setDayData({
        calories: polar.calories ?? 0,
        duration: polar.duration ?? 0,
        sleepDuration: polar.sleepDuration ?? 0,
        workouts: lyfta ? 1 : 0,
      });
    });
  }, [selectedDate, refreshKey]);

  const handleSync = async (provider: 'polar' | 'lyfta') => {
    setSyncing(prev => ({ ...prev, [provider]: true }));
    try {
      await fetch(`/api/${provider}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEV_USER_ID }),
      });
      incrementRefresh();
    } catch (error) {
      console.error(`Sync ${provider} failed:`, error);
    } finally {
      setSyncing(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Panel</h1>
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
          <MetricsCard 
            title="Calorías" 
            value={dayData.calories > 0 ? dayData.calories.toLocaleString() : '-'} 
            subtitle="kcal" 
            color="#22c55e" 
          />
          <MetricsCard 
            title="Actividad" 
            value={dayData.duration > 0 ? `${Math.round(dayData.duration / 60)} min` : '-'} 
            subtitle="movimiento" 
            color="#3b82f6" 
          />
          <MetricsCard 
            title="Sueño" 
            value={dayData.sleepDuration > 0 ? `${(dayData.sleepDuration / 3600).toFixed(1)}h` : '-'} 
            subtitle="descanso" 
            color="#f59e0b" 
          />
          <MetricsCard 
            title="Entrenamientos" 
            value={dayData.workouts > 0 ? `${dayData.workouts}` : '-'} 
            subtitle="sesiones" 
            color="#ec4899" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <PolarWidget date={selectedDate} refreshKey={refreshKey} />
          <LyftaWidget date={selectedDate} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: Dashboard wired with Zustand, date selection, real data metrics"
```

---

### Task 9: Photo Upload Fix

**Files:**
- Modify: `src/ui/components/meals/photo-upload.tsx`

- [ ] **Step 1: Fix race condition and add error handling**

```typescript
// src/ui/components/meals/photo-upload.tsx
'use client';

import { useState, useRef } from 'react';
import { DEV_USER_ID } from '@/lib/constants';

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
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      
      const base64 = dataUrl.split(',')[1];
      setIsAnalyzing(true);
      
      try {
        const response = await fetch('/api/nutrition/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: DEV_USER_ID,
            imageBase64: base64,
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const data = await response.json();
        setResult(data.meal);
      } catch (err) {
        setError('Error al analizar la imagen. Intenta de nuevo.');
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
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

      {error && (
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg text-center">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {result && (
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-green-500 font-medium">Resultado IA</div>
            <button onClick={handleReset} className="text-xs text-slate-400 hover:text-white">
              Nueva foto
            </button>
          </div>
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

- [ ] **Step 2: Commit**

```bash
git add src/ui/components/meals/photo-upload.tsx
git commit -m "fix: Photo upload race condition, add userId, error handling, reset button"
```

---

### Task 10: Routines Chat Fix

**Files:**
- Create: `src/app/api/routines/chat/route.ts`
- Modify: `src/ui/components/routines/chat-interface.tsx`

- [ ] **Step 1: Create chat API route**

```typescript
// src/app/api/routines/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAdapter } from '../../../../infrastructure/ai/claude-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { GenerateRoutineUseCase } from '../../../../application/usecases/generate-routine';
import { DEV_USER_ID } from '../../../../lib/constants';

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  try {
    const claude = new ClaudeAdapter();
    const storage = new SupabaseAdapter();
    const generateRoutine = new GenerateRoutineUseCase(claude, storage);

    const routine = await generateRoutine.execute(DEV_USER_ID, {
      goal: message,
      equipment: 'general',
      availability: 'flexible',
      experienceLevel: 'intermediate',
    });

    return NextResponse.json({ response: routine });
  } catch (error) {
    console.error('Chat routine error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Update chat interface with error handling**

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/routines/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate routine');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Error al generar la rutina. Intenta de nuevo.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-8">
            Describe qué rutina quieres y el IA la generará por ti.
          </div>
        )}
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
            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-slate-800 p-3 rounded-lg mr-8">
            <div className="text-xs text-blue-500 mb-1">Entrenador IA</div>
            <div className="text-sm animate-pulse">Pensando...</div>
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-center">
            <div className="text-red-400 text-sm">{error}</div>
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
            disabled={isLoading}
            className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
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

- [ ] **Step 3: Commit**

```bash
git add src/app/api/routines/chat/route.ts src/ui/components/routines/chat-interface.tsx
git commit -m "feat: Create routines chat API route, fix chat interface error handling"
```

---

### Task 11: Stats Page Wiring

**Files:**
- Create: `src/app/api/stats/route.ts`
- Modify: `src/app/stats/page.tsx`

- [ ] **Step 1: Create stats API route**

```typescript
// src/app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../infrastructure/storage/supabase-adapter';

export async function GET() {
  try {
    const storage = new SupabaseAdapter();
    const userId = '00000000-0000-0000-0000-000000000001';

    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 28);

    const activities = await storage.getPolarActivities(userId, monthAgo, now);
    const workouts = await storage.getLyftaWorkouts(userId, monthAgo, now);

    const totalCalories = activities.reduce((sum, a) => sum + (a.calories ?? 0), 0);
    const avgCalories = activities.length > 0 ? Math.round(totalCalories / activities.length) : 0;
    const totalVolume = workouts.reduce((sum, w) => sum + (w.volume ?? 0), 0);
    const avgDuration = activities.length > 0 
      ? Math.round(activities.reduce((sum, a) => sum + (a.duration ?? 0), 0) / activities.length / 60)
      : 0;

    return NextResponse.json({
      totalCalories,
      avgCalories,
      totalVolume,
      avgDuration,
      totalWorkouts: workouts.length,
      totalActivities: activities.length,
    });
  } catch {
    return NextResponse.json({
      totalCalories: 0,
      avgCalories: 0,
      totalVolume: 0,
      avgDuration: 0,
      totalWorkouts: 0,
      totalActivities: 0,
    });
  }
}
```

- [ ] **Step 2: Rewrite stats page**

```typescript
// src/app/stats/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalCalories: number;
  avgCalories: number;
  totalVolume: number;
  avgDuration: number;
  totalWorkouts: number;
  totalActivities: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-3">RESUMEN - ÚLTIMOS 28 DÍAS</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calorías totales</span>
                  <span className="text-green-500">{stats?.totalCalories?.toLocaleString() ?? '-'} kcal</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min((stats?.totalCalories ?? 0) / 50000 * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calorías promedio/día</span>
                  <span className="text-blue-500">{stats?.avgCalories ?? '-'} kcal</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((stats?.avgCalories ?? 0) / 2500 * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Volumen total levantado</span>
                  <span className="text-yellow-500">{stats?.totalVolume?.toLocaleString() ?? '-'} kg</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((stats?.totalVolume ?? 0) / 100000 * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-3">ACTIVIDAD</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-500">{stats?.totalWorkouts ?? 0}</div>
                <div className="text-xs text-slate-400">Entrenamientos Lyfta</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-500">{stats?.totalActivities ?? 0}</div>
                <div className="text-xs text-slate-400">Días activos Polar</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">{stats?.avgDuration ?? 0}</div>
                <div className="text-xs text-slate-400">Min promedio/día</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">
                  {stats?.totalWorkouts ? Math.round(stats.totalWorkouts / 4) : 0}/sem
                </div>
                <div className="text-xs text-slate-400">Frecuencia semanal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/stats/route.ts src/app/stats/page.tsx
git commit -m "feat: Stats page wired to real data from Polar and Lyfta"
```

---

### Task 12: Settings Page Wiring

**Files:**
- Create: `src/app/api/polar/status/route.ts`
- Create: `src/app/api/settings/profile/route.ts`
- Modify: `src/app/settings/page.tsx`

- [ ] **Step 1: Create Polar status API route**

```typescript
// src/app/api/polar/status/route.ts
import { NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { DEV_USER_ID } from '../../../../lib/constants';

export async function GET() {
  try {
    const storage = new SupabaseAdapter();
    const connection = await storage.getConnection(DEV_USER_ID, 'polar');
    return NextResponse.json({ connected: !!connection });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
```

- [ ] **Step 2: Create profile save API route**

```typescript
// src/app/api/settings/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { DEV_USER_ID } from '../../../../lib/constants';

export async function POST(request: NextRequest) {
  const { height, weight, goal, experienceLevel } = await request.json();

  try {
    const storage = new SupabaseAdapter();
    await storage.upsertProfile({
      userId: DEV_USER_ID,
      height,
      weight,
      goal,
      experienceLevel,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile save error:', error);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Rewrite settings page**

```typescript
// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEV_USER_ID } from '@/lib/constants';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [polarConnected, setPolarConnected] = useState(false);
  const [lyftaApiKey, setLyftaApiKey] = useState('');
  const [profile, setProfile] = useState({ height: '', weight: '', goal: 'maintain', experienceLevel: 'intermediate' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (searchParams.get('success') === 'polar_connected') {
      setMessage({ type: 'success', text: '¡Polar conectado correctamente!' });
      setPolarConnected(true);
    }
    if (searchParams.get('error')) {
      setMessage({ type: 'error', text: 'Error al conectar con Polar' });
    }

    fetch('/api/polar/status')
      .then(r => r.json())
      .then(data => setPolarConnected(data.connected))
      .catch(console.error);
  }, [searchParams]);

  const handleConnectPolar = () => {
    window.location.href = '/api/polar/authorize';
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          height: profile.height ? Number(profile.height) : undefined,
          weight: profile.weight ? Number(profile.weight) : undefined,
          goal: profile.goal,
          experienceLevel: profile.experienceLevel,
        }),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil guardado correctamente' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar perfil' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-400' : 'bg-red-900/30 border border-red-700 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

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
                <input 
                  type="number" 
                  value={profile.height}
                  onChange={(e) => setProfile(p => ({ ...p, height: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1" 
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Peso (kg)</label>
                <input 
                  type="number" 
                  value={profile.weight}
                  onChange={(e) => setProfile(p => ({ ...p, weight: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1" 
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Objetivo</label>
                <select 
                  value={profile.goal}
                  onChange={(e) => setProfile(p => ({ ...p, goal: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1"
                >
                  <option value="lose_weight">Perder peso</option>
                  <option value="maintain">Mantener</option>
                  <option value="gain_muscle">Ganar músculo</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Experiencia</label>
                <select 
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile(p => ({ ...p, experienceLevel: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleSaveProfile}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
            >
              Guardar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Note: Wrap in `<Suspense>` in the page component since `useSearchParams()` requires it.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/polar/status/route.ts src/app/api/settings/profile/route.ts src/app/settings/page.tsx
git commit -m "feat: Settings page wired with Polar status, profile save, success/error messages"
```

---

### Task 13: Final Testing & Polish

**Files:**
- Modify: various (typecheck fixes)

- [ ] **Step 1: Run typecheck**

```bash
npx tsc --noEmit
```

Fix any type errors.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Fix any lint errors.

- [ ] **Step 3: Test all pages locally**

```bash
npm run dev
```

Verify:
- Root `/` redirects to `/dashboard`
- Calendar starts Monday, week navigation works
- Selecting a date updates Polar/Lyfta widgets and MetricsCards
- Sync buttons work and refresh data
- Meals photo upload works (no race condition)
- Routines chat sends messages and gets responses
- Stats page shows real data
- Settings shows Polar connection status, saves profile

- [ ] **Step 4: Deploy to Vercel**

```bash
npx vercel --prod --yes
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Frontend overhaul complete - all pages wired with real data"
```
