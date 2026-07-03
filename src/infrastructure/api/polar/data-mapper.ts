import { PolarActivity, PolarSleep, PolarDailyActivity } from '../../../domain/entities/polar-data';

export class PolarDataMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toActivity(response: any, userId: string): PolarActivity {
    return {
      id: crypto.randomUUID(),
      userId,
      date: new Date(response.date),
      calories: response.calories,
      heartRateAvg: response.heart_rate_avg,
      heartRateMax: response.heart_rate_max,
      duration: response.duration,
      sleepScore: response.sleep_score,
      nightlyRecharge: response.nightly_recharge,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toSleep(response: any, userId: string): PolarSleep {
    return {
      id: crypto.randomUUID(),
      userId,
      date: new Date(response.date),
      sleepDuration: response.sleep_duration,
      sleepScore: response.sleep_score,
      deepSleep: response.deep_sleep,
      remSleep: response.rem_sleep,
      lightSleep: response.light_sleep,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toDailyActivity(response: any, userId: string, date: Date): PolarDailyActivity {
    return {
      id: crypto.randomUUID(),
      userId,
      date,
      steps: response.steps,
      calories: response.calories,
      activeMinutes: response.active_minutes,
      heartRateVariability: response.heart_rate_variability,
    };
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}