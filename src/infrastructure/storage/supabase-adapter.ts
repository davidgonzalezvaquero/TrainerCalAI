import { StoragePort } from '../../domain/interfaces/storage-port';
import { User, Profile, Connection } from '../../domain/entities/user';
import { Workout, PersonalRecord } from '../../domain/entities/workout';
import { Meal } from '../../domain/entities/meal';
import { PolarActivity, PolarSleep } from '../../domain/entities/polar-data';
import { Routine, RoutineLog } from '../../domain/entities/routine';
import { supabaseAdmin } from '../../lib/supabase-admin';

export class SupabaseAdapter implements StoragePort {
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin.auth.getUser(id);
    if (error || !data.user) return null;
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      createdAt: new Date(data.user.created_at),
    };
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return null;
    
    return {
      userId: data.user_id,
      height: data.height,
      weight: data.weight,
      bodyFat: data.body_fat,
      targetWeight: data.target_weight,
      goal: data.goal,
      experienceLevel: data.experience_level,
    };
  }

  async upsertProfile(profile: Profile): Promise<void> {
    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: profile.userId,
        height: profile.height,
        weight: profile.weight,
        body_fat: profile.bodyFat,
        target_weight: profile.targetWeight,
        goal: profile.goal,
        experience_level: profile.experienceLevel,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    
    if (error) throw error;
  }

  async getConnection(userId: string, provider: string): Promise<Connection | null> {
    const { data, error } = await supabaseAdmin
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single();
    
    if (error || !data) return null;
    
    return {
      userId: data.user_id,
      provider: data.provider,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
    };
  }

  async upsertConnection(connection: Connection): Promise<void> {
    const { error } = await supabaseAdmin
      .from('connections')
      .upsert({
        user_id: connection.userId,
        provider: connection.provider,
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken,
        expires_at: connection.expiresAt?.toISOString(),
      }, { onConflict: 'user_id,provider' });
    
    if (error) throw error;
  }

  async upsertPolarActivities(activities: PolarActivity[]): Promise<void> {
    const { error } = await supabaseAdmin
      .from('polar_activities')
      .upsert(
        activities.map(activity => ({
          user_id: activity.userId,
          date: activity.date.toISOString().split('T')[0],
          calories: activity.calories,
          heart_rate_avg: activity.heartRateAvg,
          heart_rate_max: activity.heartRateMax,
          duration: activity.duration,
          sleep_score: activity.sleepScore,
          nightly_recharge: activity.nightlyRecharge,
        })),
        { onConflict: 'user_id,date' }
      );
    
    if (error) throw error;
  }

  async upsertPolarSleep(sleep: PolarSleep[]): Promise<void> {
    const { error } = await supabaseAdmin
      .from('polar_sleep')
      .upsert(
        sleep.map(s => ({
          user_id: s.userId,
          date: s.date.toISOString().split('T')[0],
          sleep_duration: s.sleepDuration,
          sleep_score: s.sleepScore,
          deep_sleep: s.deepSleep,
          rem_sleep: s.remSleep,
          light_sleep: s.lightSleep,
        })),
        { onConflict: 'user_id,date' }
      );
    
    if (error) throw error;
  }

  async getPolarActivities(userId: string, startDate: Date, endDate: Date): Promise<PolarActivity[]> {
    const { data, error } = await supabaseAdmin
      .from('polar_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
    
    if (error || !data) return [];
    
    return data.map(activity => ({
      id: activity.id,
      userId: activity.user_id,
      date: new Date(activity.date),
      calories: activity.calories,
      heartRateAvg: activity.heart_rate_avg,
      heartRateMax: activity.heart_rate_max,
      duration: activity.duration,
      sleepScore: activity.sleep_score,
      nightlyRecharge: activity.nightly_recharge,
    }));
  }

  async getPolarSleep(userId: string, startDate: Date, endDate: Date): Promise<PolarSleep[]> {
    const { data, error } = await supabaseAdmin
      .from('polar_sleep')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
    
    if (error || !data) return [];
    
    return data.map(sleep => ({
      id: sleep.id,
      userId: sleep.user_id,
      date: new Date(sleep.date),
      sleepDuration: sleep.sleep_duration,
      sleepScore: sleep.sleep_score,
      deepSleep: sleep.deep_sleep,
      remSleep: sleep.rem_sleep,
      lightSleep: sleep.light_sleep,
    }));
  }

  async upsertLyftaWorkouts(workouts: Workout[]): Promise<void> {
    const { error } = await supabaseAdmin
      .from('lyfta_workouts')
      .upsert(
        workouts.map(workout => ({
          id: crypto.randomUUID(),
          user_id: workout.userId,
          date: workout.date.toISOString().split('T')[0],
          name: workout.name,
          exercises: JSON.stringify(workout.exercises),
          duration: workout.duration,
          volume: workout.volume,
          intensity: workout.intensity,
        })),
        { onConflict: 'user_id,date,name' }
      );

    if (error) {
      console.error('Supabase upsertLyftaWorkouts error:', error);
      throw error;
    }
  }

  async getLyftaWorkouts(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    const { data, error } = await supabaseAdmin
      .from('lyfta_workouts')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
    
    if (error || !data) return [];
    
    return data.map(workout => ({
      id: workout.id,
      userId: workout.user_id,
      date: new Date(workout.date),
      name: workout.name,
      exercises: JSON.parse(workout.exercises || '[]'),
      duration: workout.duration,
      volume: workout.volume,
      intensity: workout.intensity,
    }));
  }

  async upsertPersonalRecords(prs: PersonalRecord[]): Promise<void> {
    const { error } = await supabaseAdmin
      .from('lyfta_personal_records')
      .upsert(
        prs.map(pr => ({
          user_id: pr.userId,
          exercise_id: pr.exerciseId,
          exercise_name: pr.exerciseName,
          weight: pr.weight,
          reps: pr.reps,
          date: pr.date.toISOString().split('T')[0],
        })),
        { onConflict: 'user_id,exercise_id,date' }
      );
    
    if (error) throw error;
  }

  async upsertMeal(meal: Meal): Promise<void> {
    const { error } = await supabaseAdmin
      .from('meals')
      .upsert({
        id: meal.id,
        user_id: meal.userId,
        date: meal.date.toISOString().split('T')[0],
        time: meal.time,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        photo_url: meal.photoUrl,
        analysis_source: meal.analysisSource,
        confidence: meal.confidence,
        description: meal.description,
      }, { onConflict: 'id' });
    
    if (error) throw error;
  }

  async getMeals(userId: string, date: Date): Promise<Meal[]> {
    const { data, error } = await supabaseAdmin
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date.toISOString().split('T')[0]);
    
    if (error || !data) return [];
    
    return data.map(meal => ({
      id: meal.id,
      userId: meal.user_id,
      date: new Date(meal.date),
      time: meal.time,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      photoUrl: meal.photo_url,
      analysisSource: meal.analysis_source,
      confidence: meal.confidence,
      description: meal.description,
    }));
  }

  async saveRoutine(routine: Routine): Promise<void> {
    const { error } = await supabaseAdmin
      .from('routines')
      .upsert({
        id: routine.id,
        user_id: routine.userId,
        name: routine.name,
        exercises: JSON.stringify(routine.exercises),
        goal: routine.goal,
        difficulty: routine.difficulty,
        duration_weeks: routine.durationWeeks,
      }, { onConflict: 'id' });
    
    if (error) throw error;
  }

  async getRoutines(userId: string): Promise<Routine[]> {
    const { data, error } = await supabaseAdmin
      .from('routines')
      .select('*')
      .eq('user_id', userId);
    
    if (error || !data) return [];
    
    return data.map(routine => ({
      id: routine.id,
      userId: routine.user_id,
      name: routine.name,
      createdAt: new Date(routine.created_at),
      exercises: JSON.parse(routine.exercises || '[]'),
      goal: routine.goal,
      difficulty: routine.difficulty,
      durationWeeks: routine.duration_weeks,
    }));
  }

  async saveRoutineLog(log: RoutineLog): Promise<void> {
    const { error } = await supabaseAdmin
      .from('routine_logs')
      .upsert({
        id: log.id,
        user_id: log.userId,
        routine_id: log.routineId,
        exercise_id: log.exerciseId,
        sets: log.sets,
        reps: log.reps,
        weight: log.weight,
        completed_at: log.completedAt.toISOString(),
      }, { onConflict: 'id' });
    
    if (error) throw error;
  }
}