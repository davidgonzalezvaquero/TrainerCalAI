import { NextRequest, NextResponse } from 'next/server';
import { PolarAdapter } from '../../../../infrastructure/api/polar-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

function polarUserIdToUuid(polarUserId: string): string {
  const padded = polarUserId.padStart(12, '0');
  return `00000000-0000-0000-0000-${padded}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', request.url));
  }

  try {
    const polar = new PolarAdapter();
    const { accessToken, userId } = await polar.exchangeCodeForToken(code);
    const uuid = polarUserIdToUuid(userId);
    console.log('Polar token exchanged, userId:', userId, '-> uuid:', uuid);

    const storage = new SupabaseAdapter();
    await storage.upsertConnection({
      userId: uuid,
      provider: 'polar',
      accessToken,
    });
    console.log('Polar connection saved');

    return NextResponse.redirect(new URL('/settings?success=polar_connected', request.url));
  } catch (error) {
    console.error('Polar callback error:', error);
    return NextResponse.redirect(new URL('/settings?error=polar_auth_failed', request.url));
  }
}