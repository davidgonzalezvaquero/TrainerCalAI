'use client';

import { useState, useEffect } from 'react';

interface Profile {
  height: number | null;
  weight: number | null;
  bodyFat: number | null;
  targetWeight: number | null;
  goal: string;
  experienceLevel: string;
}

export default function SettingsPage() {
  const [polarConnected, setPolarConnected] = useState(false);
  const [lyftaApiKey, setLyftaApiKey] = useState('');
  const [profile, setProfile] = useState<Profile>({
    height: null,
    weight: null,
    bodyFat: null,
    targetWeight: null,
    goal: 'maintain',
    experienceLevel: 'beginner',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setPolarConnected(data.polarConnected);
        if (data.profile) {
          setProfile(data.profile);
        }
      })
      .catch(() => {
        setFeedback({ type: 'error', message: 'Error al cargar configuración' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConnectPolar = () => {
    window.location.href = '/api/polar/authorize';
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setFeedback({ type: 'success', message: 'Perfil guardado correctamente' });
    } catch {
      setFeedback({ type: 'error', message: 'Error al guardar perfil' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Configuración</h1>
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>

        {feedback && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              feedback.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Conexión Polar</h3>
            <p className="text-sm text-slate-400 mb-3">
              Conecta tu reloj Polar para sincronizar actividad y sueño
            </p>
            <button
              onClick={handleConnectPolar}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
            >
              {polarConnected ? '✅ Conectado' : '🔗 Conectar Polar'}
            </button>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">API Key de Lyfta</h3>
            <p className="text-sm text-slate-400 mb-3">
              Ingresa tu API key de Lyfta para sincronizar entrenamientos
            </p>
            <input
              type="password"
              value={lyftaApiKey}
              onChange={(e) => setLyftaApiKey(e.target.value)}
              placeholder="Tu API key de Lyfta"
              className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mb-3"
            />
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm">
              Guardar
            </button>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Perfil</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Altura (cm)</label>
                <input
                  type="number"
                  value={profile.height ?? ''}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Peso (kg)</label>
                <input
                  type="number"
                  value={profile.weight ?? ''}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Objetivo</label>
                <select
                  value={profile.goal}
                  onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1"
                >
                  <option value="lose_weight">Perder peso</option>
                  <option value="maintain">Mantener</option>
                  <option value="gain_muscle">Ganar músculo</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Experiencia</label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
