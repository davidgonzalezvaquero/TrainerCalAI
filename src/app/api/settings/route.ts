import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';
import { DEV_USER_ID } from '../../../lib/constants';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const userId = DEV_USER_ID;

    const [connectionRes, profileRes] = await Promise.all([
      supabase
        .from('connections')
        .select('provider, provider_user_id, expires_at')
        .eq('user_id', userId)
        .eq('provider', 'polar')
        .single(),
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single(),
    ]);

    const polarConnected = !!connectionRes.data;
    const profile = profileRes.data
      ? {
          height: profileRes.data.height,
          weight: profileRes.data.weight,
          bodyFat: profileRes.data.body_fat,
          targetWeight: profileRes.data.target_weight,
          goal: profileRes.data.goal,
          experienceLevel: profileRes.data.experience_level,
        }
      : null;

    return NextResponse.json({ polarConnected, profile });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const userId = DEV_USER_ID;
    const body = await request.json();

    const { profile } = body;

    if (profile) {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: userId,
            height: profile.height,
            weight: profile.weight,
            body_fat: profile.bodyFat,
            target_weight: profile.targetWeight,
            goal: profile.goal,
            experience_level: profile.experienceLevel,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
