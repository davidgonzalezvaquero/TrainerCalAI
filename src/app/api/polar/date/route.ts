import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { DEV_USER_ID } from '../../../../lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Missing required query parameter: date (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const storage = new SupabaseAdapter();
    const userId = DEV_USER_ID;

    const startDate = new Date(date + 'T00:00:00.000Z');
    const endDate = new Date(date + 'T23:59:59.999Z');

    const activities = await storage.getPolarActivities(userId, startDate, endDate);
    const sleepData = await storage.getPolarSleep(userId, startDate, endDate);

    const activity = activities[0];
    const sleep = sleepData[0];

    return NextResponse.json({
      activity: activity
        ? {
            calories: activity.calories,
            activeMinutes: activity.duration ? activity.duration / 60 : 0,
            heartRate: { average: activity.heartRateAvg },
          }
        : null,
      sleep: sleep
        ? {
            sleepScore: sleep.sleepScore,
            duration: sleep.sleepDuration,
            deepSleep: sleep.deepSleep,
            remSleep: sleep.remSleep,
            lightSleep: sleep.lightSleep,
          }
        : null,
    });
  } catch {
    return NextResponse.json({
      activity: null,
      sleep: null,
    });
  }
}
