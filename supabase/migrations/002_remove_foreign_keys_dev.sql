-- Remove foreign key constraints for development (single-user mode without auth)
ALTER TABLE public.lyfta_workouts DROP CONSTRAINT IF EXISTS lyfta_workouts_user_id_fkey;
ALTER TABLE public.lyfta_personal_records DROP CONSTRAINT IF EXISTS lyfta_personal_records_user_id_fkey;
ALTER TABLE public.meals DROP CONSTRAINT IF EXISTS meals_user_id_fkey;
ALTER TABLE public.polar_activities DROP CONSTRAINT IF EXISTS polar_activities_user_id_fkey;
ALTER TABLE public.polar_sleep DROP CONSTRAINT IF EXISTS polar_sleep_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.connections DROP CONSTRAINT IF EXISTS connections_user_id_fkey;
ALTER TABLE public.routines DROP CONSTRAINT IF EXISTS routines_user_id_fkey;
ALTER TABLE public.routine_logs DROP CONSTRAINT IF EXISTS routine_logs_user_id_fkey;