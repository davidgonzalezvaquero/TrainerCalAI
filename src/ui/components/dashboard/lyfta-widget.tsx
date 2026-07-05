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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const dateStr = date.toISOString().split('T')[0];
        const res = await fetch(`/api/lyfta/date?date=${dateStr}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching Lyfta data: ${res.status}`);
        }
        
        const data = await res.json();
        setWorkout(data.workouts?.[0] ?? null);
      } catch (err) {
        console.error('Failed to fetch Lyfta data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos de Lyfta');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-slate-400">Cargando datos de Lyfta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-red-400">{error}</div>
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