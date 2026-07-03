import Anthropic from '@anthropic-ai/sdk';
import { Routine, RoutineExercise } from '../../domain/entities/routine';
import { PolarActivity, PolarSleep } from '../../domain/entities/polar-data';
import { Workout } from '../../domain/entities/workout';
import { AIPort } from '../../domain/interfaces/ai-port';
import { Meal } from '../../domain/entities/meal';
import { FitnessLevel } from '../../domain/entities/types';

const VALID_FITNESS_LEVELS: FitnessLevel[] = ['beginner', 'intermediate', 'advanced'];

export class ClaudeAdapter implements AIPort {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing required environment variable: ANTHROPIC_API_KEY');
    }
    this.client = new Anthropic({ apiKey });
  }

  async analyzeFood(): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>> {
    throw new Error('Use OpenAIAdapter for food analysis');
  }

  async generateRoutine(params: {
    polarActivities: PolarActivity[];
    polarSleep: PolarSleep[];
    workouts: Workout[];
    goal: string;
    equipment: string[];
    availability: number;
    experienceLevel: string;
  }): Promise<Routine> {
    try {
      const prompt = this.buildPrompt(params);

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : '{}';
      
      let result: { name?: string; exercises?: Array<Partial<RoutineExercise>>; durationWeeks?: number };
      try {
        result = JSON.parse(content);
      } catch {
        result = {};
      }

      const experienceLevel = VALID_FITNESS_LEVELS.includes(params.experienceLevel as FitnessLevel)
        ? (params.experienceLevel as FitnessLevel)
        : 'intermediate';

      return {
        id: crypto.randomUUID(),
        userId: '',
        name: result.name || 'Generated Routine',
        createdAt: new Date(),
        exercises: (result.exercises || []).map((ex): RoutineExercise => ({
          exerciseId: ex.exerciseId || crypto.randomUUID(),
          exerciseName: ex.exerciseName || 'Unknown Exercise',
          sets: ex.sets || 3,
          reps: ex.reps || '10',
          restSeconds: ex.restSeconds || 60,
          weight: ex.weight,
          notes: ex.notes,
        })),
        goal: params.goal,
        difficulty: experienceLevel,
        durationWeeks: result.durationWeeks || 4,
      };
    } catch (error) {
      throw new Error(`Failed to generate routine: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(params: {
    polarActivities: PolarActivity[];
    polarSleep: PolarSleep[];
    workouts: Workout[];
    goal: string;
    equipment: string[];
    availability: number;
    experienceLevel: string;
  }): string {
    const recentActivities = params.polarActivities.slice(-7);
    const recentSleep = params.polarSleep.slice(-7);
    const recentWorkouts = params.workouts.slice(-10);

    return `You are an expert fitness trainer. Generate a personalized workout routine based on this data:

USER PROFILE:
- Goal: ${params.goal}
- Experience: ${params.experienceLevel}
- Available equipment: ${params.equipment.join(', ')}
- Hours per week available: ${params.availability}

RECENT POLAR DATA (last 7 days):
${recentActivities.map(a => `- ${a.date.toISOString().split('T')[0]}: ${a.calories} cal, HR avg ${a.heartRateAvg}, ${a.duration}min`).join('\n')}

RECENT SLEEP (last 7 days):
${recentSleep.map(s => `- ${s.date.toISOString().split('T')[0]}: ${s.sleepDuration}min, score ${s.sleepScore}`).join('\n')}

RECENT WORKOUTS:
${recentWorkouts.map(w => `- ${w.date.toISOString().split('T')[0]}: ${w.name}, ${w.exercises.length} exercises, ${w.duration}min`).join('\n')}

Generate a JSON routine with this exact structure:
{
  "name": "Routine Name",
  "durationWeeks": 4,
  "exercises": [
    {
      "exerciseId": "unique-id",
      "exerciseName": "Exercise Name",
      "sets": 4,
      "reps": "8-12",
      "weight": null,
      "restSeconds": 90,
      "notes": "optional notes"
    }
  ]
}

Focus on progressive overload and consider recent sleep/recovery data.`;
  }
}