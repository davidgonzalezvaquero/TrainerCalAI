import { LyftaPort } from '../../domain/interfaces/lyfta-port';
import { Workout } from '../../domain/entities/workout';
import { Routine } from '../../domain/entities/routine';

const LYFTA_API_BASE = 'https://my.lyfta.app/api/v1';

interface LyftaSetResponse {
  reps: number;
  weight: number;
  rpe?: number;
  is_warmup?: boolean;
  is_drop_set?: boolean;
}

interface LyftaExerciseResponse {
  id: number;
  name: string;
  muscle_group: string;
  equipment?: string;
  sets: LyftaSetResponse[];
}

interface LyftaWorkoutResponse {
  id: number;
  date: string;
  name: string;
  exercises: LyftaExerciseResponse[];
  duration: number;
  volume: number;
  intensity: number;
}

export class LyftaAdapter implements LyftaPort {
  async getWorkouts(apiKey: string, page: number = 1, limit: number = 50): Promise<Workout[]> {
    const response = await fetch(
      `${LYFTA_API_BASE}/workouts?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Lyfta workouts: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.workouts || !Array.isArray(data.workouts)) {
      return [];
    }

    return data.workouts.map((workout: LyftaWorkoutResponse) => ({
      id: (workout.id ?? crypto.randomUUID()).toString(),
      userId: '',
      date: new Date(workout.date),
      name: workout.name,
      exercises: workout.exercises.map((ex: LyftaExerciseResponse) => ({
        id: ex.id.toString(),
        name: ex.name,
        sets: ex.sets.map((set: LyftaSetResponse) => ({
          reps: set.reps,
          weight: set.weight,
          rpe: set.rpe,
          isWarmup: set.is_warmup,
          isDropSet: set.is_drop_set,
        })),
        muscleGroup: ex.muscle_group,
        equipment: ex.equipment,
      })),
      duration: workout.duration,
      volume: workout.volume,
      intensity: workout.intensity,
    }));
  }

  async getExercises(apiKey: string): Promise<{ id: string; name: string; muscleGroup: string }[]> {
    const response = await fetch(`${LYFTA_API_BASE}/exercises`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Lyfta exercises: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.exercises || !Array.isArray(data.exercises)) {
      return [];
    }

    return data.exercises.map((ex: LyftaExerciseResponse) => ({
      id: (ex.id ?? crypto.randomUUID()).toString(),
      name: ex.name,
      muscleGroup: ex.muscle_group,
    }));
  }

  async pushRoutine(apiKey: string, routine: Routine): Promise<{ success: boolean; templateId?: string }> {
    const response = await fetch(`${LYFTA_API_BASE}/templates`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: {
          name: routine.name,
          exercises: routine.exercises.map((ex) => ({
            exercise_id: ex.exerciseId,
            name: ex.exerciseName,
            sets: Array.from({ length: ex.sets }, () => ({
              reps: parseInt(ex.reps) || 8,
              weight: ex.weight || 0,
              rest_seconds: ex.restSeconds,
            })),
          })),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to push routine to Lyfta: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      templateId: data.template_id?.toString(),
    };
  }
}
