# Project Setup & Dependencies - Design Spec

**Date:** 2026-07-03
**Status:** Approved
**Author:** opencode + user

## Overview

Initialize Next.js project for TrainerCalAI with all required dependencies, configurations, and shadcn/ui setup.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Package Manager | npm | User preference |
| Next.js Version | 14 (stable) | Matches existing design spec |
| Tailwind CSS Version | v3 (stable) | Widely used, stable |
| shadcn/ui Theme | Slate | Cool gray tones preferred |
| TypeScript | Strict mode enabled | Recommended for new projects |
| Initialization | create-next-app + TypeScript + Tailwind | Fastest setup with customization |

## Files to Create/Modify

1. **Base project files** (via create-next-app):
   - `package.json`
   - `tsconfig.json`
   - `tailwind.config.ts`
   - `postcss.config.js`
   - `next.config.js`
   - `src/app/layout.tsx`
   - `src/app/page.tsx`
   - `src/app/globals.css`

2. **Additional files:**
   - `.env.local.example` - Environment variables template

## Dependencies

### Production
- `@supabase/supabase-js` - Supabase client
- `zustand` - State management
- `openai` - OpenAI API client
- `@anthropic-ai/sdk` - Claude API client

### Development
- `@types/node` - Node.js types

### shadcn/ui Components
- button, card, input, label, tabs

## Environment Variables Template

```env
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
```

## Implementation Steps

1. Run `create-next-app` with TypeScript + Tailwind templates
2. Install production dependencies
3. Install development dependencies
4. Initialize shadcn/ui with Slate theme
5. Add shadcn/ui components
6. Create `.env.local.example`
7. Verify TypeScript compilation
8. Verify dev server starts
9. Commit all changes

## Success Criteria

- Next.js project initializes without errors
- All dependencies installed successfully
- TypeScript compiles with strict mode
- Dev server starts and serves default page
- shadcn/ui components available
- Environment variables template created
