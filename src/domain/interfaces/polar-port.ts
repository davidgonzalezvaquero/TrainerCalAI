import { PolarActivity, PolarSleep, PolarDailyActivity } from '../entities/polar-data';

export interface PolarPort {
  getAuthorizationUrl(): string;
  exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }>;
  getActivities(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarActivity[]>;
  getSleep(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarSleep[]>;
  getDailyActivity(userId: string, accessToken: string, date: Date): Promise<PolarDailyActivity>;
}