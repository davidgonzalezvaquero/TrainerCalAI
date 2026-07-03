-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  height NUMERIC,
  weight NUMERIC,
  body_fat NUMERIC,
  target_weight NUMERIC,
  goal TEXT CHECK (goal IN ('lose_weight', 'maintain', 'gain_muscle')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- External connections
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT CHECK (provider IN ('polar', 'lyfta')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Polar activities
CREATE TABLE public.polar_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calories NUMERIC,
  heart_rate_avg NUMERIC,
  heart_rate_max NUMERIC,
  duration NUMERIC,
  sleep_score NUMERIC,
  nightly_recharge NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Polar sleep
CREATE TABLE public.polar_sleep (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sleep_duration NUMERIC,
  sleep_score NUMERIC,
  deep_sleep NUMERIC,
  rem_sleep NUMERIC,
  light_sleep NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Lyfta workouts
CREATE TABLE public.lyfta_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT,
  exercises JSONB,
  duration NUMERIC,
  volume NUMERIC,
  intensity NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records
CREATE TABLE public.lyfta_personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT,
  exercise_name TEXT,
  weight NUMERIC,
  reps NUMERIC,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT,
  name TEXT,
  calories NUMERIC,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  photo_url TEXT,
  analysis_source TEXT CHECK (analysis_source IN ('ai', 'manual')),
  confidence NUMERIC,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routines
CREATE TABLE public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  exercises JSONB,
  goal TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routine logs
CREATE TABLE public.routine_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
  exercise_id TEXT,
  sets NUMERIC,
  reps NUMERIC,
  weight NUMERIC,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polar_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polar_sleep ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyfta_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyfta_personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_logs ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own connections" ON public.connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own connections" ON public.connections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own polar data" ON public.polar_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own polar data" ON public.polar_activities FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own polar sleep" ON public.polar_sleep FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own polar sleep" ON public.polar_sleep FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workouts" ON public.lyfta_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workouts" ON public.lyfta_workouts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own PRs" ON public.lyfta_personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own PRs" ON public.lyfta_personal_records FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own routines" ON public.routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own routines" ON public.routines FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own routine logs" ON public.routine_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own routine logs" ON public.routine_logs FOR ALL USING (auth.uid() = user_id);