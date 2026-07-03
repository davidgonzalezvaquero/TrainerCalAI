export interface Workout {
  id: string;
  userId: string;
  date: Date;
  name: string;
  exercises: Exercise[];
  duration: number; // minutes
  volume: number; // kg
  intensity: number; // 1-10
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  muscleGroup: string;
  equipment?: string;
}

export interface Set {
  reps: number;
  weight: number;
  rpe?: number; // 1-10 Rate of Perceived Exertion
  isWarmup?: boolean;
  isDropSet?: boolean;
}

export interface PersonalRecord {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: Date;
}
