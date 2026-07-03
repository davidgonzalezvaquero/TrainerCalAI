# Task 8: Use Cases

## Objective
Create application use cases (business logic layer).

## Requirements

### Files to Create
- `src/application/usecases/sync-polar.ts` - SyncPolarUseCase
- `src/application/usecases/sync-lyfta.ts` - SyncLyftaUseCase
- `src/application/usecases/analyze-meal.ts` - AnalyzeMealUseCase
- `src/application/usecases/generate-routine.ts` - GenerateRoutineUseCase
- `src/application/usecases/push-routine.ts` - PushRoutineUseCase

### Use Case Definitions

**SyncPolarUseCase:**
- execute(userId, accessToken, startDate, endDate): Promise<void>
- Fetches Polar activities and sleep, saves to storage

**SyncLyftaUseCase:**
- execute(apiKey, userId): Promise<void>
- Fetches Lyfta workouts, saves to storage

**AnalyzeMealUseCase:**
- execute(userId, imageBase64, date, time): Promise<Meal>
- Analyzes food photo with AI, saves meal to storage

**GenerateRoutineUseCase:**
- execute(userId, params): Promise<Routine>
- Fetches user data, generates routine with AI, saves to storage

**PushRoutineUseCase:**
- execute(apiKey, routine): Promise<{ success: boolean; templateId?: string }>
- Pushes routine to Lyfta

## Acceptance Criteria
- [ ] All 5 use cases implemented
- [ ] Use cases depend on interfaces (ports), not implementations
- [ ] Proper error handling
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/8-use-cases`
- Commit message: `feat: add application use cases`