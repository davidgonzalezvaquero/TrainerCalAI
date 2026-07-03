import { NextRequest, NextResponse } from 'next/server';
import { LyftaAdapter } from '../../../../infrastructure/api/lyfta-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { SyncLyftaUseCase } from '../../../../application/usecases/sync-lyfta';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  try {
    const storage = new SupabaseAdapter();
    const apiKey = process.env.LYFTA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Lyfta API key not configured' }, { status: 400 });
    }

    const lyfta = new LyftaAdapter();
    const syncLyfta = new SyncLyftaUseCase(lyfta, storage);

    await syncLyfta.execute(apiKey, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}