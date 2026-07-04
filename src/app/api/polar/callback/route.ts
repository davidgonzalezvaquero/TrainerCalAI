import { NextRequest, NextResponse } from 'next/server';
import { PolarAdapter } from '../../../../infrastructure/api/polar-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', request.url));
  }

  try {
    const polar = new PolarAdapter();
    const { accessToken, userId: polarUserId } = await polar.exchangeCodeForToken(code);

    const storage = new SupabaseAdapter();
    await storage.upsertConnection({
      userId: DEV_USER_ID,
      provider: 'polar',
      accessToken,
      providerUserId: polarUserId,
    });
    console.log('Polar connection saved for', DEV_USER_ID, 'polarUserId:', polarUserId);

    return NextResponse.redirect(new URL('/settings?success=polar_connected', request.url));
  } catch (error) {
    console.error('Polar callback error:', error);
    return NextResponse.redirect(new URL('/settings?error=polar_auth_failed', request.url));
  }
}