import { LyftaPort } from '../../domain/interfaces/lyfta-port';
import { StoragePort } from '../../domain/interfaces/storage-port';

export class SyncLyftaUseCase {
  constructor(
    private lyftaPort: LyftaPort,
    private storagePort: StoragePort
  ) {}

  async execute(apiKey: string, userId: string): Promise<void> {
    try {
      const workouts = await this.lyftaPort.getWorkouts(apiKey);
      const workoutsWithUser = workouts.map(w => ({ ...w, userId }));
      await this.storagePort.upsertLyftaWorkouts(workoutsWithUser);
    } catch (error) {
      throw new Error(`Failed to sync Lyfta data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}