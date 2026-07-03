import { Meal } from '../entities/meal';
import { Routine } from '../entities/routine';
import { PolarActivity, PolarSleep } from '../entities/polar-data';
import { Workout } from '../entities/workout';

export interface AIPort {
  analyzeFood(imageBase64: string): Promise<Omit<Meal, 'id' | 'userId' | 'date' | 'time'>>;
  generateRoutine(params: {
    polarActivities: PolarActivity[];
    polarSleep: PolarSleep[];
    workouts: Workout[];
    goal: string;
    equipment: string[];
    availability: number;
    experienceLevel: string;
  }): Promise<Routine>;
}