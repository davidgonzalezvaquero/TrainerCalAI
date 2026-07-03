import { AIPort } from '../../domain/interfaces/ai-port';
import { StoragePort } from '../../domain/interfaces/storage-port';
import { Routine } from '../../domain/entities/routine';

export class GenerateRoutineUseCase {
  constructor(
    private aiPort: AIPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, params: {
    goal: string;
    equipment: string[];
    availability: number;
    experienceLevel: string;
  }): Promise<Routine> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const polarActivities = await this.storagePort.getPolarActivities(userId, startDate, endDate);
    const polarSleep = await this.storagePort.getPolarSleep(userId, startDate, endDate);
    const workouts = await this.storagePort.getLyftaWorkouts(userId, startDate, endDate);

    const routine = await this.aiPort.generateRoutine({
      polarActivities,
      polarSleep,
      workouts,
      ...params,
    });

    routine.userId = userId;
    await this.storagePort.saveRoutine(routine);
    return routine;
  }
}