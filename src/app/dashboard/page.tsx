'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { DEV_USER_ID } from '@/lib/constants';
import { MetricsCard } from '@/ui/components/dashboard/metrics-card';
import { PolarWidget } from '@/ui/components/dashboard/polar-widget';
import { LyftaWidget } from '@/ui/components/dashboard/lyfta-widget';
import { CalendarWidget } from '@/ui/components/dashboard/calendar-widget';

export default function DashboardPage() {
  const { selectedDate, setSelectedDate, refreshKey, incrementRefresh } = useDashboardStore();
  const [syncing, setSyncing] = useState({ polar: false, lyfta: false });
  const [polarData, setPolarData] = useState<{ activity: any; sleep: any } | null>(null);
  const [lyftaData, setLyftaData] = useState<{ workouts: any[] } | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingMetrics(true);
    Promise.all([
      fetch(`/api/polar/date?date=${selectedDate}`).then(r => r.json()),
      fetch(`/api/lyfta/date?date=${selectedDate}`).then(r => r.json()),
    ]).then(([polar, lyfta]) => {
      setPolarData(polar);
      setLyftaData(lyfta);
    }).finally(() => setLoadingMetrics(false));
  }, [selectedDate, refreshKey]);

  const handleSync = async (provider: 'polar' | 'lyfta') => {
    setSyncing(prev => ({ ...prev, [provider]: true }));
    try {
      await fetch(`/api/${provider}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEV_USER_ID }),
      });
      incrementRefresh();
    } finally {
      setSyncing(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleSync('polar')}
              disabled={syncing.polar}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
            >
              {syncing.polar ? '⏳' : '🔄'} Sincronizar Polar
            </button>
            <button
              onClick={() => handleSync('lyfta')}
              disabled={syncing.lyfta}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
            >
              {syncing.lyfta ? '⏳' : '🔄'} Sincronizar Lyfta
            </button>
          </div>
        </div>

        <CalendarWidget
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <div className="grid grid-cols-4 gap-4 mt-6">
          <MetricsCard
            title="Calorías quemadas"
            value={loadingMetrics ? '...' : (polarData?.activity?.calories ?? '—')}
            subtitle={polarData?.activity ? `${polarData.activity.activeMinutes} min activos` : 'Sin datos'}
            color="#22c55e"
          />
          <MetricsCard
            title="Sueño"
            value={loadingMetrics ? '...' : (polarData?.sleep?.duration ? `${(polarData.sleep.duration / 60).toFixed(1)}h` : '—')}
            subtitle={polarData?.sleep ? `Score: ${polarData.sleep.sleepScore}/100` : 'Sin datos'}
            color="#f59e0b"
          />
          <MetricsCard
            title="HR Promedio"
            value={loadingMetrics ? '...' : (polarData?.activity?.heartRate?.average ?? '—')}
            subtitle={polarData?.activity?.nightlyRecharge ? `Recharge: ${polarData.activity.nightlyRecharge}` : 'Sin datos'}
            color="#ec4899"
          />
          <MetricsCard
            title="Entrenos Lyfta"
            value={loadingMetrics ? '...' : (lyftaData?.workouts?.length ?? 0)}
            subtitle={lyftaData?.workouts?.length ? `${lyftaData.workouts.length} sesión(es)` : 'Sin datos'}
            color="#3b82f6"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <PolarWidget key={`polar-${refreshKey}`} date={selectedDate} />
          <LyftaWidget key={`lyfta-${refreshKey}`} date={selectedDate} />
        </div>
      </div>
    </div>
  );
}