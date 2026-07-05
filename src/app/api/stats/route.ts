import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';
import { DEV_USER_ID } from '../../../lib/constants';

function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const userId = DEV_USER_ID;
    const { start, end } = getWeekRange();

    const [activitiesRes, sleepRes, workoutsRes, mealsRes] = await Promise.all([
      supabase
        .from('polar_activities')
        .select('calories, duration')
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end),
      supabase
        .from('polar_sleep')
        .select('sleep_score')
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end),
      supabase
        .from('lyfta_workouts')
        .select('id')
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end),
      supabase
        .from('meals')
        .select('calories, protein, carbs, fat')
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end),
    ]);

    const totalCalories = (activitiesRes.data ?? []).reduce(
      (sum, a) => sum + (a.calories ?? 0),
      0
    );
    const totalActiveMinutes = (activitiesRes.data ?? []).reduce(
      (sum, a) => sum + (a.duration ? a.duration / 60 : 0),
      0
    );
    const sleepScores = (sleepRes.data ?? []).map((s) => s.sleep_score).filter(Boolean);
    const avgSleepScore =
      sleepScores.length > 0
        ? Math.round(sleepScores.reduce((a, b) => a + b, 0) / sleepScores.length)
        : 0;
    const totalWorkouts = (workoutsRes.data ?? []).length;

    const meals = mealsRes.data ?? [];
    const avgCaloriesPerDay =
      meals.length > 0 ? Math.round(meals.reduce((s, m) => s + (m.calories ?? 0), 0) / 7) : 0;
    const totalProtein = meals.reduce((s, m) => s + (m.protein ?? 0), 0);
    const totalCarbs = meals.reduce((s, m) => s + (m.carbs ?? 0), 0);
    const totalFat = meals.reduce((s, m) => s + (m.fat ?? 0), 0);
    const totalMealsCalories = meals.reduce((s, m) => s + (m.calories ?? 0), 0);

    return NextResponse.json({
      weekStart: start,
      weekEnd: end,
      workouts: {
        total: totalWorkouts,
      },
      calories: {
        totalBurned: totalCalories,
        avgPerDay: avgCaloriesPerDay,
      },
      sleep: {
        avgScore: avgSleepScore,
        daysTracked: sleepScores.length,
      },
      activity: {
        totalActiveMinutes,
      },
      nutrition: {
        totalCalories: totalMealsCalories,
        avgCaloriesPerDay,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
