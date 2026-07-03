import { NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

export async function GET() {
  try {
    const storage = new SupabaseAdapter();

    // TODO: Get userId from auth session
    const userId = 'current-user';

    const workouts = await storage.getLyftaWorkouts(userId);
    const lastWorkout = workouts[workouts.length - 1];

    if (!lastWorkout) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      name: lastWorkout.name,
      date: lastWorkout.date.toISOString(),
      duration: lastWorkout.duration,
      volume: lastWorkout.volume,
      exercises: lastWorkout.exercises.length,
      prs: 0,
    });
  } catch {
    return NextResponse.json(null);
  }
}