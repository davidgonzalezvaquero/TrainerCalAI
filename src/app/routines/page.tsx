'use client';

import { ChatInterface } from '@/ui/components/routines/chat-interface';

export default function RoutinesPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-2xl font-bold">Generador de Rutinas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Habla con tu entrenador IA para crear rutinas personalizadas
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}