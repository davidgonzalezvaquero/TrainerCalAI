export interface Meal {
  id: string;
  userId: string;
  date: Date;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photoUrl?: string;
  analysisSource: 'ai' | 'manual';
  confidence?: number;
  description?: string;
}

export interface DailyMacros {
  date: string;
  calories: { consumed: number; target: number; burned: number };
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
}
