'use client';

import { useEffect, useState } from 'react';

interface PolarData {
  nightlyRecharge: number;
  hrv: number;
  steps: number;
  sleepScore: number;
  sleepDuration: number;
  calories: number;
  activeMinutes: number;
}

export function PolarWidget() {
  const [data, setData] = useState<PolarData | null>(null);

  useEffect(() => {
    fetch('/api/polar/today')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-sm text-slate-400">Loading Polar data...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">POLAR - ACTIVIDAD 24/7</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-xs text-slate-400">Calorías</div>
          <div className="text-lg font-bold text-green-500">{data.calories.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Actividad (min)</div>
          <div className="text-lg font-bold text-blue-500">{Math.round(data.activeMinutes)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Sueño (h)</div>
          <div className="text-lg font-bold text-yellow-500">{data.sleepDuration > 0 ? (data.sleepDuration / 3600).toFixed(1) : '-'}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div>
          <div className="text-xs text-slate-400">Recharge Nocturna</div>
          <div className="text-lg font-bold text-green-500">{data.nightlyRecharge > 0 ? `${data.nightlyRecharge}%` : '-'}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">HRV (ms)</div>
          <div className="text-lg font-bold text-blue-500">{data.hrv > 0 ? data.hrv : '-'}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Score Sueño</div>
          <div className="text-lg font-bold text-yellow-500">{data.sleepScore > 0 ? data.sleepScore : '-'}</div>
        </div>
      </div>
    </div>
  );
}