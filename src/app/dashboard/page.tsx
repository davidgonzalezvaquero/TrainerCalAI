'use client';

import { useState } from 'react';
import { MetricsCard } from '@/ui/components/dashboard/metrics-card';
import { PolarWidget } from '@/ui/components/dashboard/polar-widget';
import { LyftaWidget } from '@/ui/components/dashboard/lyfta-widget';
import { CalendarWidget } from '@/ui/components/dashboard/calendar-widget';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [syncing, setSyncing] = useState({ polar: false, lyfta: false });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSync = async (provider: 'polar' | 'lyfta') => {
    setSyncing(prev => ({ ...prev, [provider]: true }));
    try {
      await fetch(`/api/${provider}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '00000000-0000-0000-0000-000000000001' }),
      });
      setRefreshKey(prev => prev + 1);
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
          <MetricsCard title="Calorías objetivo" value="1,850" subtitle="Consumidas: 1,420" color="#22c55e" />
          <MetricsCard title="Calorías quemadas" value="650" subtitle="Ejercicio: 420" color="#3b82f6" />
          <MetricsCard title="Sueño" value="7.5h" subtitle="Score: 82/100" color="#f59e0b" />
          <MetricsCard title="HR Promedio" value="68" subtitle="Max: 145 bpm" color="#ec4899" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <PolarWidget key={`polar-${refreshKey}`} />
          <LyftaWidget key={`lyfta-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}