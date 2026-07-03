export interface PolarActivity {
  id: string;
  userId: string;
  date: Date;
  calories: number;
  heartRateAvg: number;
  heartRateMax: number;
  duration: number; // minutes
  sleepScore?: number;
  nightlyRecharge?: number;
}

export interface PolarSleep {
  id: string;
  userId: string;
  date: Date;
  sleepDuration: number; // minutes
  sleepScore: number;
  deepSleep: number; // minutes
  remSleep: number; // minutes
  lightSleep: number; // minutes
}

export interface PolarDailyActivity {
  userId: string;
  date: Date;
  steps: number;
  calories: number;
  activeMinutes: number;
  heartRateVariability?: number;
}
