import { NextRequest, NextResponse } from 'next/server';
import { PolarAdapter } from '../../../../infrastructure/api/polar-adapter';
import { SupabaseAdapter } from '../../../../infrastructure/storage/supabase-adapter';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', request.url));
  }

  try {
    const polar = new PolarAdapter();
    const { accessToken, userId } = await polar.exchangeCodeForToken(code);
    console.log('Polar token exchanged, userId:', userId);

    const storage = new SupabaseAdapter();
    await storage.upsertConnection({
      userId,
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