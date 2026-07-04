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
      const uniqueActivities = Array.from(new Map(mappedActivities.map(a => [`${a.userId}-${a.date.toISOString().split('T')[0]}`, a])).values());
      await this.storagePort.upsertPolarActivities(uniqueActivities);

      const sleep = await this.polarPort.getSleep(polarUserId, accessToken, startDate, endDate);
      const mappedSleep = sleep.map(s => ({ ...s, userId }));
      const uniqueSleep = Array.from(new Map(mappedSleep.map(s => [`${s.userId}-${s.date.toISOString().split('T')[0]}`, s])).values());
      await this.storagePort.upsertPolarSleep(uniqueSleep);
    } catch (error) {
      console.error('SyncPolarUseCase error:', error);
      throw new Error(`Failed to sync Polar data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}