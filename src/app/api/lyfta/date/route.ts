import { NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { DEV_USER_ID } from '../../../../lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const storage = new SupabaseAdapter();
    const userId = DEV_USER_ID;

    // Query workouts for the specific date
    const startDate = new Date(dateParam);
    const endDate = new Date(dateParam);
    endDate.setDate(endDate.getDate() + 1); // End of day (exclusive)

    const workouts = await storage.getLyftaWorkouts(userId, startDate, endDate);

    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Lyfta date query error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}