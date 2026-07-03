'use client';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-3">PROGRESO - ÚLTIMO MES</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Peso</span>
                  <span className="text-green-500">-2.3 kg ↓</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Volumen semanal</span>
                  <span className="text-blue-500">+12% ↑</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calorías promedio</span>
                  <span className="text-yellow-500">1,750/día</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-3">DISTRIBUCIÓN MACROS</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-500">42g</div>
                <div className="text-xs text-slate-400">Proteína</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">38g</div>
                <div className="text-xs text-slate-400">Carbohidratos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">18g</div>
                <div className="text-xs text-slate-400">Grasa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}