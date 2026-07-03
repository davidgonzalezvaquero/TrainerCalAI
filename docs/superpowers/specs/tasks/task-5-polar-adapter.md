# Task 5: Polar Adapter

## Objective
Create Polar API adapter implementing PolarPort interface.

## Requirements

### Files to Create
- `src/infrastructure/api/polar-adapter.ts` - PolarPort implementation

### PolarPort Methods to Implement

```typescript
getAuthorizationUrl(): string;
exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }>;
getActivities(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarActivity[]>;
getSleep(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarSleep[]>;
getDailyActivity(userId: string, accessToken: string, date: Date): Promise<PolarDailyActivity>;
```

### API Details

- **Auth Base:** `https://auth.polar.com`
- **API Base:** `https://polaraccesslink.com/v3`
- **OAuth Flow:** Authorization code → token exchange
- **Rate Limits:** 1 req/sec, burst 100

### Environment Variables Used
- `POLAR_CLIENT_ID`
- `POLAR_CLIENT_SECRET`
- `POLAR_REDIRECT_URI`

## Acceptance Criteria
- [ ] Implements PolarPort interface
- [ ] OAuth2 flow works correctly
- [ ] API calls use proper authentication
- [ ] Error handling included
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/5-polar-adapter`
- Commit message: `feat: add Polar API adapter`