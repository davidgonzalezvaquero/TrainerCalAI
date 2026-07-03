'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [polarConnected, setPolarConnected] = useState(false);
  const [lyftaApiKey, setLyftaApiKey] = useState('');

  const handleConnectPolar = () => {
    window.location.href = '/api/polar/authorize';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>
        
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
                <input type="number" className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Peso (kg)</label>
                <input type="number" className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Objetivo</label>
                <select className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1">
                  <option value="lose_weight">Perder peso</option>
                  <option value="maintain">Mantener</option>
                  <option value="gain_muscle">Ganar músculo</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Experiencia</label>
                <select className="w-full bg-slate-700 rounded-lg px-4 py-2 text-sm mt-1">
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}