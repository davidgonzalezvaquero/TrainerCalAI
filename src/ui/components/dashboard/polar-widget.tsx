'use client';

import { useEffect, useState } from 'react';

interface PolarData {
  nightlyRecharge: number;
  hrv: number;
  steps: number;
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
          <div className="text-xs text-slate-400">Nightly Recharge</div>
          <div className="text-lg font-bold text-green-500">{data.nightlyRecharge}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">HRV (ms)</div>
          <div className="text-lg font-bold text-blue-500">{data.hrv}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Pasos</div>
          <div className="text-lg font-bold text-yellow-500">{data.steps.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}