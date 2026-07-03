import { PolarPort } from '../../domain/interfaces/polar-port';
import { StoragePort } from '../../domain/interfaces/storage-port';

export class SyncPolarUseCase {
  constructor(
    private polarPort: PolarPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<void> {
    try {
      const activities = await this.polarPort.getActivities(userId, accessToken, startDate, endDate);
      await this.storagePort.upsertPolarActivities(activities);

      const sleep = await this.polarPort.getSleep(userId, accessToken, startDate, endDate);
      await this.storagePort.upsertPolarSleep(sleep);
    } catch (error) {
      throw new Error(`Failed to sync Polar data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}