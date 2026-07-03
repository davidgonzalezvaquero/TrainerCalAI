import { PolarPort } from '../../domain/interfaces/polar-port';
import { StoragePort } from '../../domain/interfaces/storage-port';

export class SyncPolarUseCase {
  constructor(
    private polarPort: PolarPort,
    private storagePort: StoragePort
  ) {}

  async execute(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<void> {
    const activities = await this.polarPort.getActivities(userId, accessToken, startDate, endDate);
    await this.storagePort.upsertPolarActivities(activities);

    const sleep = await this.polarPort.getSleep(userId, accessToken, startDate, endDate);
    await this.storagePort.upsertPolarSleep(sleep);
  }
}