import { PolarPort } from '../../domain/interfaces/polar-port';
import { StoragePort } from '../../domain/interfaces/storage-port';

export class SyncPolarUseCase {
  constructor(
    private polarPort: PolarPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, polarUserId: string, accessToken: string, startDate: Date, endDate: Date): Promise<void> {
    try {
      const activities = await this.polarPort.getActivities(polarUserId, accessToken, startDate, endDate);
      const mappedActivities = activities.map(a => ({ ...a, userId }));
      await this.storagePort.upsertPolarActivities(mappedActivities);

      const sleep = await this.polarPort.getSleep(polarUserId, accessToken, startDate, endDate);
      const mappedSleep = sleep.map(s => ({ ...s, userId }));
      await this.storagePort.upsertPolarSleep(mappedSleep);
    } catch (error) {
      throw new Error(`Failed to sync Polar data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}