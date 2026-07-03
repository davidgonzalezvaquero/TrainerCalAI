import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAdapter } from '../../../../infrastructure/ai/claude-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { GenerateRoutineUseCase } from '../../../../application/usecases/generate-routine';

export async function POST(request: NextRequest) {
  const { userId, goal, equipment, availability, experienceLevel } = await request.json();

  try {
    const claude = new ClaudeAdapter();
    const storage = new SupabaseAdapter();
    const generateRoutine = new GenerateRoutineUseCase(claude, storage);

    const routine = await generateRoutine.execute(userId, {
      goal,
      equipment,
      availability,
      experienceLevel,
    });

    return NextResponse.json({ success: true, routine });
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}