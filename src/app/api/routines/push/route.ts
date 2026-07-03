import { NextRequest, NextResponse } from 'next/server';
import { LyftaAdapter } from '../../../../infrastructure/api/lyfta-adapter';
import { PushRoutineUseCase } from '../../../../application/usecases/push-routine';

export async function POST(request: NextRequest) {
  const { apiKey, routine } = await request.json();

  try {
    const lyfta = new LyftaAdapter();
    const pushRoutine = new PushRoutineUseCase(lyfta);

    const result = await pushRoutine.execute(apiKey, routine);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Push failed' }, { status: 500 });
  }
}