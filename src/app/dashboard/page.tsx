'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { DEV_USER_ID } from '@/lib/constants';
import { PolarWidget } from '@/ui/components/dashboard/polar-widget';
import { LyftaWidget } from '@/ui/components/dashboard/lyfta-widget';
import { CalendarWidget } from '@/ui/components/dashboard/calendar-widget';
import { ErrorBoundary } from '@/ui/components/shared/error-boundary';

export default function DashboardPage() {
  const { selectedDate, setSelectedDate, refreshKey, incrementRefresh } = useDashboardStore();
  const [syncing, setSyncing] = useState({ polar: false, lyfta: false });

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

        <div className="grid grid-cols-2 gap-4 mt-6">
          <ErrorBoundary>
            <PolarWidget key={`polar-${refreshKey}`} date={selectedDate} />
          </ErrorBoundary>
          <ErrorBoundary>
            <LyftaWidget key={`lyfta-${refreshKey}`} date={selectedDate} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}