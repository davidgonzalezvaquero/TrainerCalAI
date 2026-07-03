import { LyftaPort } from '../../domain/interfaces/lyfta-port';
import { Routine } from '../../domain/entities/routine';

export class PushRoutineUseCase {
  constructor(private lyftaPort: LyftaPort) {}

  async execute(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }> {
    try {
      return await this.lyftaPort.pushRoutine(apiKey, routine);
    } catch (error) {
      throw new Error(`Failed to push routine to Lyfta: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}