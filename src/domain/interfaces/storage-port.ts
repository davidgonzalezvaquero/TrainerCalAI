import { User, Profile, Connection } from '../entities/user';
import { Workout, PersonalRecord } from '../entities/workout';
import { Meal } from '../entities/meal';
import { PolarActivity, PolarSleep } from '../entities/polar-data';
import { Routine, RoutineLog } from '../entities/routine';

export interface StoragePort {
  // Users
  getUser(id: string): Promise<User | null>;
  getProfile(userId: string): Promise<Profile | null>;
  upsertProfile(profile: Profile): Promise<void>;
  
  // Connections
  getConnection(userId: string, provider: string): Promise<Connection | null>;
  upsertConnection(connection: Connection): Promise<void>;
  
  // Polar
  upsertPolarActivities(activities: PolarActivity[]): Promise<void>;
  upsertPolarSleep(sleep: PolarSleep[]): Promise<void>;
  getPolarActivities(userId: string, startDate: Date, endDate: Date): Promise<PolarActivity[]>;
  getPolarSleep(userId: string, startDate: Date, endDate: Date): Promise<PolarSleep[]>;
  
  // Lyfta
  upsertLyftaWorkouts(workouts: Workout[]): Promise<void>;
  getLyftaWorkouts(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>;
  upsertPersonalRecords(prs: PersonalRecord[]): Promise<void>;
  
  // Meals
  upsertMeal(meal: Meal): Promise<void>;
  getMeals(userId: string, date: Date): Promise<Meal[]>;
  
  // Routines
  saveRoutine(routine: Routine): Promise<void>;
  getRoutines(userId: string): Promise<Routine[]>;
  saveRoutineLog(log: RoutineLog): Promise<void>;
}