import { NextRequest, NextResponse } from 'next/server';
import { OpenAIAdapter } from '../../../../infrastructure/ai/openai-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { AnalyzeMealUseCase } from '../../../../application/usecases/analyze-meal';

export async function POST(request: NextRequest) {
  const { userId, imageBase64, date, time } = await request.json();

  try {
    const openai = new OpenAIAdapter();
    const storage = new SupabaseAdapter();
    const analyzeMeal = new AnalyzeMealUseCase(openai, storage);

    const meal = await analyzeMeal.execute(userId, imageBase64, new Date(date), time);

    return NextResponse.json({ success: true, meal });
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}