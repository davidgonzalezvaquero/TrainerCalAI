# Task 3: Domain Interfaces (Ports)

## Objective
Create all domain interfaces (ports) for the hexagonal architecture.

## Requirements

### Files to Create
- `src/domain/interfaces/polar-port.ts` - PolarPort interface
- `src/domain/interfaces/lyfta-port.ts` - LyftaPort interface
- `src/domain/interfaces/ai-port.ts` - AIPort interface
- `src/domain/interfaces/storage-port.ts` - StoragePort interface

### Interface Definitions

**PolarPort:**
```typescript
getAuthorizationUrl(): string;
exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }>;
getActivities(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarActivity[]>;
getSleep(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarSleep[]>;
getDailyActivity(userId: string, accessToken: string, date: Date): Promise<PolarDailyActivity>;
```

**LyftaPort:**
```typescript
getWorkouts(apiKey: string, page?: number, limit?: number): Promise<Workout[]>;
getExercises(apiKey: string): Promise<{ id: string; name: string; muscleGroup: string }[]>;
pushRoutine(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }>;
```

**AIPort:**
```typescript
analyzeFood(imageBase64: string): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>>;
generateRoutine(params: { polarActivities, polarSleep, workouts, goal, equipment, availability, experienceLevel }): Promise<Routine>;
```

**StoragePort:**
```typescript
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
```

## Acceptance Criteria
- [ ] All interfaces properly typed
- [ ] Import entities from domain/entities
- [ ] No implementation, only interface definitions
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/3-domain-interfaces`
- Commit message: `feat: add domain interfaces (ports)`