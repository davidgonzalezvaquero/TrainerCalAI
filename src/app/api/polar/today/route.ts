import { NextResponse } from 'next/server';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

export async function GET() {
  try {
    const storage = new SupabaseAdapter();

    // TODO: Get userId from auth session
    const userId = '00000000-0000-0000-0000-000000000001';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activities = await storage.getPolarActivities(userId, today, today);
    const sleep = await storage.getPolarSleep(userId, today, today);

    const activity = activities[0];
    const sleepData = sleep[0];

    return NextResponse.json({
      nightlyRecharge: activity?.nightlyRecharge ?? 0,
      hrv: 0,
      steps: 0,
      sleepScore: sleepData?.sleepScore ?? 0,
      sleepDuration: sleepData?.sleepDuration ?? 0,
    });
  } catch {
    return NextResponse.json({
      nightlyRecharge: 0,
      hrv: 0,
      steps: 0,
      sleepScore: 0,
      sleepDuration: 0,
    });
  }
}