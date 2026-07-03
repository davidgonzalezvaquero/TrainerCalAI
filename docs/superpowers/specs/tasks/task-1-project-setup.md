# Task 1: Project Setup & Dependencies

## Objective
Initialize Next.js project with all required dependencies and configuration files.

## Requirements

### Files to Create
- `package.json` - Project configuration
- `tsconfig.json` - TypeScript configuration  
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `.env.local.example` - Environment variables template

### Dependencies to Install
**Production:**
- `@supabase/supabase-js` - Supabase client
- `zustand` - State management
- `openai` - OpenAI API client
- `@anthropic-ai/sdk` - Claude API client

**Development:**
- `@types/node` - Node.js types

### shadcn/ui Setup
- Initialize shadcn/ui
- Add components: button, card, input, label, tabs

### Environment Variables Template
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

## Acceptance Criteria
- [ ] Next.js project initializes successfully
- [ ] All dependencies installed without errors
- [ ] TypeScript compiles without errors
- [ ] Tailwind CSS works
- [ ] shadcn/ui components available
- [ ] `.env.local.example` contains all required variables

## Git Branch
- Branch name: `task/1-project-setup`
- Commit message: `feat: initialize Next.js project with dependencies`