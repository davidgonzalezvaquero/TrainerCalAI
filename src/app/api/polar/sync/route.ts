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

    const polar = new PolarAdapter();
    const syncPolar = new SyncPolarUseCase(polar, storage);

    await syncPolar.execute(
      userId,
      connection.accessToken,
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}