'use client';

import { useState, useRef } from 'react';

interface AnalysisResult {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export function PhotoUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);

      const base64 = dataUrl.split(',')[1];
      try {
        const response = await fetch('/api/nutrition/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
          }),
        });

        if (!response.ok) throw new Error(`Analysis failed: ${response.status}`);

        const data = await response.json();
        setResult(data.meal);
      } catch (error) {
        console.error('Analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
      >
        {preview ? (
          <img src={preview} alt="Food" className="max-h-64 mx-auto rounded-lg" />
        ) : (
          <>
            <div className="text-4xl mb-2">📸</div>
            <div className="text-slate-400">Arrastra una foto o haz click para seleccionar</div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {isAnalyzing && (
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="animate-pulse text-slate-400">Analizando comida...</div>
        </div>
      )}

      {result && (
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-green-500 font-medium mb-2">Resultado IA</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>🔥 Calorías: <strong>{result.calories} kcal</strong></div>
            <div>🥩 Proteína: <strong>{result.protein}g</strong></div>
            <div>🍞 Carbohidratos: <strong>{result.carbs}g</strong></div>
            <div>🧈 Grasa: <strong>{result.fat}g</strong></div>
          </div>
          <div className="text-xs text-slate-500 mt-3">
            Confianza: {result.confidence}% • {result.description}
          </div>
        </div>
      )}
    </div>
  );
}