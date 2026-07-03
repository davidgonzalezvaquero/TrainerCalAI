import { Workout } from '../entities/workout';
import { Routine } from '../entities/routine';

export interface LyftaPort {
  getWorkouts(apiKey: string, page?: number, limit?: number): Promise<Workout[]>;
  getExercises(apiKey: string): Promise<{ id: string; name: string; muscleGroup: string }[]>;
  pushRoutine(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }>;
}