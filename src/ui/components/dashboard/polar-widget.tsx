'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from './metrics-card';

interface PolarData {
  activity: {
    calories: number;
    activeMinutes: number;
    heartRate: { average: number };
    nightlyRecharge: number;
  } | null;
  sleep: {
    sleepScore: number;
    duration: number;
    deepSleep: number;
    remSleep: number;
    lightSleep: number;
  } | null;
}

interface PolarWidgetProps {
  date: Date;
}

export function PolarWidget({ date }: PolarWidgetProps) {
  const [data, setData] = useState<PolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const dateStr = date.toISOString().split('T')[0];
        const res = await fetch(`/api/polar/date?date=${dateStr}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching Polar data: ${res.status}`);
        }
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch Polar data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos de Polar');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-slate-400">Cargando datos de Polar...</div>
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

  const activity = data?.activity;
  const sleep = data?.sleep;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">POLAR - ACTIVIDAD 24/7</h3>
      <div className="grid grid-cols-3 gap-2">
        <MetricCard
          title="Calorías quemadas"
          value={activity?.calories?.toLocaleString() ?? '-'}
          subtitle="kcal"
          color="#ef4444"
        />
        <MetricCard
          title="Minutos activos"
          value={activity?.activeMinutes ? Math.round(activity.activeMinutes) : '-'}
          subtitle="min"
          color="#3b82f6"
        />
        <MetricCard
          title="Calidad del sueño"
          value={sleep?.sleepScore ?? '-'}
          subtitle={sleep?.duration ? formatDuration(sleep.duration) : undefined}
          color="#a855f7"
        />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <MetricCard
          title="Recuperación nocturna"
          value={activity?.nightlyRecharge ? `${activity.nightlyRecharge}%` : '-'}
          color="#22c55e"
        />
        <MetricCard
          title="Frecuencia cardíaca media"
          value={activity?.heartRate?.average ?? '-'}
          subtitle="bpm"
          color="#f97316"
        />
        <MetricCard
          title="Eficiencia del sueño"
          value={sleep?.deepSleep ? `${Math.round(sleep.deepSleep)}%` : '-'}
          subtitle="Sueño profundo"
          color="#06b6d4"
        />
      </div>
    </div>
  );
}