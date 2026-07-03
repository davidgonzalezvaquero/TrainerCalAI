import OpenAI from 'openai';
import { Meal } from '../../domain/entities/meal';
import { AIPort } from '../../domain/interfaces/ai-port';
import { PolarActivity, PolarSleep } from '../../domain/entities/polar-data';
import { Workout } from '../../domain/entities/workout';
import { Routine } from '../../domain/entities/routine';

export class OpenAIAdapter implements AIPort {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing required environment variable: OPENAI_API_KEY');
    }
    this.client = new OpenAI({ apiKey });
  }

  async analyzeFood(imageBase64: string): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this food photo and provide:
1. Description of the food
2. Estimated calories
3. Protein in grams
4. Carbohydrates in grams
5. Fat in grams
6. Confidence level (0-100)

Respond in JSON format:
{
  "description": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": number
}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      
      let result: any;
      try {
        result = JSON.parse(content);
      } catch {
        result = {};
      }

      return {
        name: result.description || 'Unknown food',
        calories: result.calories || 0,
        protein: result.protein || 0,
        carbs: result.carbs || 0,
        fat: result.fat || 0,
        analysisSource: 'ai',
        confidence: result.confidence || 0,
        description: result.description,
      };
    } catch (error) {
      throw new Error(`Failed to analyze food: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
    throw new Error('Use ClaudeAdapter for routine generation');
  }
}