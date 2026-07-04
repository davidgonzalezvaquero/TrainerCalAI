import { FitnessLevel } from './types';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Profile {
  userId: string;
  height: number; // cm
  weight: number; // kg
  bodyFat?: number;
  targetWeight?: number;
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  experienceLevel: FitnessLevel;
}

export interface Connection {
  userId: string;
  provider: 'polar' | 'lyfta';
  accessToken: string;
  providerUserId?: string;
  refreshToken?: string;
  expiresAt?: Date;
}
