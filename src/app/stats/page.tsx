'use client';

import { useState, useEffect } from 'react';

interface Stats {
  weekStart: string;
  weekEnd: string;
  workouts: { total: number };
  calories: { totalBurned: number; avgPerDay: number };
  sleep: { avgScore: number; daysTracked: number };
  activity: { totalActiveMinutes: number };
  nutrition: {
    totalCalories: number;
    avgCaloriesPerDay: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

function formatMinutes(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${Math.round(mins)}m`;
}

function formatWeight(g: number): string {
  if (g >= 1000) return `${(g / 1000).toFixed(1)}kg`;
  return `${Math.round(g)}g`;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then(setStats)
      .catch(() => setError('No se pudieron cargar las estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>

        {loading && (
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800 p-4 rounded-lg animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/2 mb-4" />
                <div className="space-y-3">
                  <div className="h-3 bg-slate-700 rounded" />
                  <div className="h-3 bg-slate-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}

        {stats && !loading && (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Semana: {stats.weekStart} — {stats.weekEnd}
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-3">RESUMEN SEMANAL</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Entrenamientos</span>
                      <span className="text-blue-500">{stats.workouts.total}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(stats.workouts.total * 20, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Calorías quemadas</span>
                      <span className="text-green-500">{stats.calories.totalBurned.toLocaleString()} kcal</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min((stats.calories.totalBurned / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tiempo activo</span>
                      <span className="text-yellow-500">{formatMinutes(stats.activity.totalActiveMinutes)}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${Math.min((stats.activity.totalActiveMinutes / 600) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-3">SUEÑO</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score promedio</span>
                      <span className="text-purple-500">{stats.sleep.avgScore}/100</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${stats.sleep.avgScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Días rastreados</span>
                      <span className="text-slate-300">{stats.sleep.daysTracked}/7</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-slate-400 rounded-full"
                        style={{ width: `${(stats.sleep.daysTracked / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-3">NUTRICIÓN PROMEDIO/DÍA</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Calorías</span>
                      <span className="text-orange-500">{stats.nutrition.avgCaloriesPerDay.toLocaleString()} kcal</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${Math.min((stats.nutrition.avgCaloriesPerDay / 2500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-3">MACROS TOTALES</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-500">{formatWeight(stats.nutrition.protein)}</div>
                    <div className="text-xs text-slate-400">Proteína</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">{formatWeight(stats.nutrition.carbs)}</div>
                    <div className="text-xs text-slate-400">Carbohidratos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{formatWeight(stats.nutrition.fat)}</div>
                    <div className="text-xs text-slate-400">Grasa</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
