# Task 9: API Routes

## Objective
Create Next.js API routes for all integrations.

## Requirements

### Files to Create
- `src/app/api/polar/authorize/route.ts` - Polar OAuth redirect
- `src/app/api/polar/callback/route.ts` - Polar OAuth callback
- `src/app/api/polar/sync/route.ts` - Sync Polar data
- `src/app/api/lyfta/sync/route.ts` - Sync Lyfta data
- `src/app/api/nutrition/analyze/route.ts` - Analyze food photo
- `src/app/api/routines/generate/route.ts` - Generate routine
- `src/app/api/routines/push/route.ts` - Push routine to Lyfta

### Route Definitions

**GET /api/polar/authorize** - Redirects to Polar OAuth

**GET /api/polar/callback** - Handles OAuth callback, saves connection

**POST /api/polar/sync** - Syncs Polar data for user

**POST /api/lyfta/sync** - Syncs Lyfta data for user

**POST /api/nutrition/analyze** - Analyzes food photo with AI

**POST /api/routines/generate** - Generates routine with AI

**POST /api/routines/push** - Pushes routine to Lyfta

## Acceptance Criteria
- [ ] All 7 API routes created
- [ ] Proper HTTP methods (GET/POST)
- [ ] Error handling with appropriate status codes
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/9-api-routes`
- Commit message: `feat: add API routes for all integrations`