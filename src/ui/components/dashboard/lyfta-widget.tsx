'use client';

import { useEffect, useState } from 'react';

interface Workout {
  name: string;
  date: string;
  duration: number;
  volume: number;
  exercises: number;
  prs: number;
}

export function LyftaWidget() {
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    fetch('/api/lyfta/last-workout')
      .then(res => res.json())
      .then(setWorkout)
      .catch(console.error);
  }, []);

  if (!workout) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-slate-400">Loading Lyfta data...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">LYFTA - ÚLTIMO ENTRENAMIENTO</h3>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold">{workout.name}</div>
          <div className="text-sm text-slate-400 mt-1">
            ⏱️ {workout.duration} min • 🏋️ {workout.volume.toLocaleString()} kg vol. • 📊 {workout.exercises} ejercicios
          </div>
        </div>
        {workout.prs > 0 && (
          <span className="text-green-500 text-sm">🏆 {workout.prs} PRs</span>
        )}
      </div>
    </div>
  );
}