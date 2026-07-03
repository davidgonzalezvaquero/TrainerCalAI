# Task 2: Domain Entities

## Objective
Create all domain entities (TypeScript interfaces) for the application.

## Requirements

### Files to Create
- `src/domain/entities/user.ts` - User, Profile, Connection interfaces
- `src/domain/entities/workout.ts` - Workout, Exercise, Set, PersonalRecord interfaces
- `src/domain/entities/meal.ts` - Meal, DailyMacros interfaces
- `src/domain/entities/polar-data.ts` - PolarActivity, PolarSleep, PolarDailyActivity interfaces
- `src/domain/entities/routine.ts` - Routine, RoutineExercise, RoutineLog interfaces

### Entity Definitions

**User entities:**
- `User` - id, email, createdAt
- `Profile` - userId, height, weight, bodyFat?, targetWeight?, goal, experienceLevel
- `Connection` - userId, provider (polar|lyfta), accessToken, refreshToken?, expiresAt?

**Workout entities:**
- `Workout` - id, userId, date, name, exercises[], duration, volume, intensity
- `Exercise` - id, name, sets[], muscleGroup, equipment?
- `Set` - reps, weight, rpe?, isWarmup?, isDropSet?
- `PersonalRecord` - userId, exerciseId, exerciseName, weight, reps, date

**Meal entities:**
- `Meal` - id, userId, date, time, name, calories, protein, carbs, fat, photoUrl?, analysisSource, confidence?, description?
- `DailyMacros` - date, calories{consumed,target,burned}, protein{consumed,target}, carbs{consumed,target}, fat{consumed,target}

**Polar entities:**
- `PolarActivity` - id, userId, date, calories, heartRateAvg, heartRateMax, duration, sleepScore?, nightlyRecharge?
- `PolarSleep` - id, userId, date, sleepDuration, sleepScore, deepSleep, remSleep, lightSleep
- `PolarDailyActivity` - userId, date, steps, calories, activeMinutes, heartRateVariability?

**Routine entities:**
- `Routine` - id, userId, name, createdAt, exercises[], goal, difficulty, durationWeeks
- `RoutineExercise` - exerciseId, exerciseName, sets, reps, weight?, restSeconds, notes?
- `RoutineLog` - id, userId, routineId, exerciseId, sets, reps, weight, completedAt

## Acceptance Criteria
- [ ] All interfaces are properly typed
- [ ] All optional fields marked with `?`
- [ ] Enums used for constrained values (goal, experienceLevel, analysisSource, difficulty)
- [ ] No runtime code, only type definitions
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/2-domain-entities`
- Commit message: `feat: add domain entities`