# Task 7: AI Adapters (OpenAI + Claude)

## Objective
Create AI adapters for food analysis (OpenAI) and routine generation (Claude).

## Requirements

### Files to Create
- `src/infrastructure/ai/openai-adapter.ts` - Food analysis with GPT-4 Vision
- `src/infrastructure/ai/claude-adapter.ts` - Routine generation with Claude

### OpenAI Adapter

Methods:
- `analyzeFood(imageBase64: string): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>>`

Uses GPT-4 Vision to analyze food photos and return:
- description
- calories
- protein
- carbs
- fat
- confidence

### Claude Adapter

Methods:
- `generateRoutine(params): Promise<Routine>`

Uses Claude to generate personalized workout routines based on:
- Polar activities and sleep data
- Lyfta workout history
- User goals and equipment
- Availability and experience level

## Acceptance Criteria
- [ ] OpenAI adapter implements food analysis
- [ ] Claude adapter implements routine generation
- [ ] Proper prompts for AI models
- [ ] Error handling included
- [ ] TypeScript compiles without errors

## Git Branch
- Branch name: `task/7-ai-adapters`
- Commit message: `feat: add AI adapters for food analysis and routine generation`