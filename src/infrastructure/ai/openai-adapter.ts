import OpenAI from 'openai';
import { Meal } from '../../domain/entities/meal';

export class OpenAIAdapter {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeFood(imageBase64: string): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-vision-preview',
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
    const result = JSON.parse(content);

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
  }
}
