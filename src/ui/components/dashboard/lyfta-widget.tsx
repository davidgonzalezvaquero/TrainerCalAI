'use client';

import { useEffect, useState } from 'react';

interface Workout {
  name: string | null;
  date: string;
  duration: number | null;
  volume: number | null;
  exercises: number;
  prs: number;
}

export function LyftaWidget() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch('/api/lyfta/last-workout')
      .then(res => res.json())
      .then(data => {
        setWorkout(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-slate-400">Loading Lyfta data...</div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-slate-400 mb-3">LYFTA - ÚLTIMO ENTRENAMIENTO</h3>
        <div className="text-sm text-slate-400">No hay datos. Sincronizá con Lyfta primero.</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">LYFTA - ÚLTIMO ENTRENAMIENTO</h3>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold">{workout.name || 'Entrenamiento'}</div>
          <div className="text-sm text-slate-400 mt-1">
            {workout.duration ? `⏱️ ${workout.duration} min • ` : ''}
            {workout.volume ? `🏋️ ${workout.volume.toLocaleString()} kg vol. • ` : ''}
            📊 {workout.exercises} ejercicios
          </div>
        </div>
        {workout.prs > 0 && (
          <span className="text-green-500 text-sm">🏆 {workout.prs} PRs</span>
        )}
      </div>
    </div>
  );
}