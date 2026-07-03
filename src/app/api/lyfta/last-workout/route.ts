import { NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

export async function GET() {
  try {
    const storage = new SupabaseAdapter();

    // TODO: Get userId from auth session
    const userId = '00000000-0000-0000-0000-000000000001';

    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    const end = new Date();
    console.log('Querying workouts for userId:', userId, 'from', start.toISOString(), 'to', end.toISOString());
    const workouts = await storage.getLyftaWorkouts(userId, start, end);
    console.log('Last workout query returned:', workouts.length, 'workouts');
    if (workouts.length > 0) {
      console.log('First workout:', JSON.stringify(workouts[0], null, 2));
    }

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
  } catch (error) {
    console.error('Last workout error:', error);
    return NextResponse.json(null);
  }
}