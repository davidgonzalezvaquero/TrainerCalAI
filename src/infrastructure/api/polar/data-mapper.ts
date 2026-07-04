import { PolarActivity, PolarSleep, PolarDailyActivity } from '../../../domain/entities/polar-data';

export class PolarDataMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toActivity(response: any, userId: string, fallbackDate?: Date): PolarActivity {
    const hr = response['heart-rate'] ?? response.heart_rate ?? {};
    return {
      id: crypto.randomUUID(),
      userId,
      date: fallbackDate ?? new Date(response.date),
      calories: response.calories ?? response.energy ?? 0,
      heartRateAvg: hr['inaverage'] ?? hr.avg ?? hr.heart_rate_avg ?? 0,
      heartRateMax: hr['inmax'] ?? hr.max ?? hr.heart_rate_max ?? 0,
      duration: response.duration ?? response.active_duration ?? 0,
      sleepScore: response.sleep_score ?? 0,
      nightlyRecharge: response.nightly_recharge ?? 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toSleep(response: any, userId: string): PolarSleep {
    return {
      id: crypto.randomUUID(),
      userId,
      date: new Date(response.date),
      sleepDuration: response['total-sleep-duration'] ?? response.sleep_duration ?? 0,
      sleepScore: response['sleep-score'] ?? response.sleep_score ?? 0,
      deepSleep: response['deep-sleep'] ?? response.deep_sleep ?? 0,
      remSleep: response['rem-sleep'] ?? response.rem_sleep ?? 0,
      lightSleep: response['light-sleep'] ?? response.light_sleep ?? 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toDailyActivity(response: any, userId: string, date: Date): PolarDailyActivity {
    return {
      id: crypto.randomUUID(),
      userId,
      date,
      steps: response.steps ?? 0,
      calories: response.calories ?? 0,
      activeMinutes: response.active_minutes ?? 0,
      heartRateVariability: response.heart_rate_variability ?? 0,
    };
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}