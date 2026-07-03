# Task 6: Lyfta Adapter

## Objective
Create Lyfta API adapter implementing LyftaPort interface.

## Requirements

### Files to Create
- `src/infrastructure/api/lyfta-adapter.ts` - LyftaPort implementation

### LyftaPort Methods to Implement

```typescript
getWorkouts(apiKey: string, page?: number, limit?: number): Promise<Workout[]>;
getExercises(apiKey: string): Promise<{ id: string; name: string; muscleGroup: string }[]>;
pushRoutine(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }>;
```

### API Details

- **API Base:** `https://my.lyfta.app/api/v1`
- **Auth:** Bearer token (API key)
- **Endpoints:**
  - GET /api/v1/workouts
  - GET /api/v1/exercises
  - POST /api/v1/templates

### Environment Variables Used
- `LYFTA_API_KEY`

## Acceptance Criteria
- [ ] Implements LyftaPort interface
- [ ] API calls use proper authentication
- [ ] Data mapping between API response and domain entities
- [ ] Error handling included
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/6-lyfta-adapter`
- Commit message: `feat: add Lyfta API adapter`