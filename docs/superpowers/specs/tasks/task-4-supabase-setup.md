# Task 4: Supabase Setup & Adapter

## Objective
Create Supabase database migration and storage adapter implementing StoragePort.

## Requirements

### Files to Create
- `supabase/migrations/001_initial_schema.sql` - Database schema
- `src/lib/supabase-client.ts` - Supabase client setup
- `src/infrastructure/storage/supabase-adapter.ts` - StoragePort implementation

### Database Schema

Tables to create:
- `profiles` - User fitness profiles
- `connections` - External API connections (Polar, Lyfta)
- `polar_activities` - Polar activity data
- `polar_sleep` - Polar sleep data
- `lyfta_workouts` - Lyfta workout data
- `lyfta_personal_records` - Personal records from Lyfta
- `meals` - Food tracking data
- `routines` - Generated workout routines
- `routine_logs` - Routine completion logs

All tables need:
- Row Level Security (RLS) enabled
- Policies for user-scoped access
- Proper foreign keys to auth.users

### Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Storage Adapter

Implements StoragePort with all 15 methods:
- getUser, getProfile, upsertProfile
- getConnection, upsertConnection
- upsertPolarActivities, upsertPolarSleep, getPolarActivities, getPolarSleep
- upsertLyftaWorkouts, getLyftaWorkouts, upsertPersonalRecords
- upsertMeal, getMeals
- saveRoutine, getRoutines, saveRoutineLog

## Acceptance Criteria
- [ ] Migration SQL is valid PostgreSQL
- [ ] RLS policies correctly scope data to authenticated user
- [ ] SupabaseAdapter implements all StoragePort methods
- [ ] TypeScript compiles without errors
- [ ] Build passes

## Git Branch
- Branch name: `task/4-supabase-setup`
- Commit message: `feat: add Supabase setup and storage adapter`