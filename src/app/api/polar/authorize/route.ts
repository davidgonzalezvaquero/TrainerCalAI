import { NextResponse } from 'next/server';
import { PolarAdapter } from '../../../../infrastructure/api/polar-adapter';

export async function GET() {
  try {
    const polar = new PolarAdapter();
    const authUrl = polar.getAuthorizationUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate authorization URL' }, { status: 500 });
  }
}