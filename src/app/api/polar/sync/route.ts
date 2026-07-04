import { NextRequest, NextResponse } from 'next/server';
import { PolarAdapter } from '../../../../infrastructure/api/polar-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';
import { SyncPolarUseCase } from '../../../../application/usecases/sync-polar';

export async function POST(request: NextRequest) {
  const { userId, startDate, endDate } = await request.json();

  try {
    const storage = new SupabaseAdapter();
    const connection = await storage.getConnection(userId, 'polar');

    if (!connection) {
      return NextResponse.json({ error: 'Polar not connected' }, { status: 400 });
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const polar = new PolarAdapter();
    const syncPolar = new SyncPolarUseCase(polar, storage);

    await syncPolar.execute(userId, connection.providerUserId ?? userId, connection.accessToken, start, end);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Polar sync error:', error);
    return NextResponse.json({ error: 'Sync failed', details: String(error) }, { status: 500 });
  }
}