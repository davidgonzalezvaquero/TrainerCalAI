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

interface LyftaWidgetProps {
  date: Date;
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function LyftaWidget({ date }: LyftaWidgetProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    const dateStr = date.toISOString().split('T')[0];
    fetch(`/api/lyfta/date?date=${dateStr}`)
      .then(res => res.json())
      .then(data => {
        setWorkout(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [date]);

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
        <h3 className="text-sm font-medium text-slate-400 mb-3">LYFTA</h3>
        <div className="text-sm text-slate-400">Sin entrenamiento registrado</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">LYFTA</h3>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold">{workout.name || 'Entrenamiento'}</div>
          <div className="text-sm text-slate-400 mt-1">
            {workout.duration ? `⏱️ ${formatDuration(workout.duration)} • ` : ''}
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