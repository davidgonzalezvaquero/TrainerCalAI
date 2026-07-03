import { NextResponse } from 'next/server';
import { PolarAdapter } from '../../../../infrastructure/api/polar-adapter';

export async function GET() {
  try {
    const polar = new PolarAdapter();
    const authUrl = polar.getAuthorizationUrl();
    console.log('Polar auth URL:', authUrl);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Polar authorize error:', error);
    return NextResponse.json({ error: 'Failed to generate authorization URL' }, { status: 500 });
  }
}