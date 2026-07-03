import { LyftaPort } from '../../domain/interfaces/lyfta-port';
import { Routine } from '../../domain/entities/routine';

export class PushRoutineUseCase {
  constructor(private lyftaPort: LyftaPort) {}

  async execute(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }> {
    return this.lyftaPort.pushRoutine(apiKey, routine);
  }
}