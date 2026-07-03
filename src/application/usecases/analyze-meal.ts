import { AIPort } from '../../domain/interfaces/ai-port';
import { StoragePort } from '../../domain/interfaces/storage-port';
import { Meal } from '../../domain/entities/meal';

export class AnalyzeMealUseCase {
  constructor(
    private aiPort: AIPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, imageBase64: string, date: Date, time: string): Promise<Meal> {
    try {
      const analysis = await this.aiPort.analyzeFood(imageBase64);
      
      const meal: Meal = {
        id: crypto.randomUUID(),
        userId,
        date,
        time,
        ...analysis,
      };

      await this.storagePort.upsertMeal(meal);
      return meal;
    } catch (error) {
      throw new Error(`Failed to analyze meal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}