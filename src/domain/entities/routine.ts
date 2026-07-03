export interface Routine {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  exercises: RoutineExercise[];
  goal: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
}

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string; // e.g., "8-12" or "AMRAP"
  weight?: number;
  restSeconds: number;
  notes?: string;
}

export interface RoutineLog {
  id: string;
  userId: string;
  routineId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  completedAt: Date;
}
