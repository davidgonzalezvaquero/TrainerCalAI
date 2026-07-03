'use client';

import { PhotoUpload } from '@/ui/components/meals/photo-upload';

export default function MealsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Análisis de Comidas</h1>
        <PhotoUpload />
      </div>
    </div>
  );
}