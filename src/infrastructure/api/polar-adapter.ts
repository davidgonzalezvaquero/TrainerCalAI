import { PolarPort } from '../../domain/interfaces/polar-port';
import { PolarActivity, PolarSleep, PolarDailyActivity } from '../../domain/entities/polar-data';

const POLAR_API_BASE = 'https://polaraccesslink.com/v3';
const POLAR_AUTH_BASE = 'https://auth.polar.com';

interface PolarActivityResponse {
  date: string;
  calories: number;
  heart_rate_avg: number;
  heart_rate_max: number;
  duration: number;
  sleep_score?: number;
  nightly_recharge?: number;
}

interface PolarSleepResponse {
  date: string;
  sleep_duration: number;
  sleep_score: number;
  deep_sleep: number;
  rem_sleep: number;
  light_sleep: number;
}

interface PolarDailyActivityResponse {
  steps: number;
  calories: number;
  active_minutes: number;
  heart_rate_variability?: number;
}

export class PolarAdapter implements PolarPort {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.POLAR_CLIENT_ID;
    this.clientSecret = process.env.POLAR_CLIENT_SECRET;
    this.redirectUri = process.env.POLAR_REDIRECT_URI;

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('Missing required Polar environment variables: POLAR_CLIENT_ID, POLAR_CLIENT_SECRET, POLAR_REDIRECT_URI');
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'accesslink.read_all',
    });
    return `${POLAR_AUTH_BASE}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }> {
    const response = await fetch(`${POLAR_AUTH_BASE}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    
    // Register user and get user ID
    const userResponse = await fetch(`${POLAR_API_BASE}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'member-id': crypto.randomUUID(),
      }),
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to register Polar user: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    
    return {
      accessToken: data.access_token,
      userId: userData['polar-user-id'],
    };
  }

  async getActivities(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarActivity[]> {
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);
    
    const response = await fetch(
      `${POLAR_API_BASE}/users/${userId}/activity-samples/${start}/${end}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Polar activities');
    }

    const data = await response.json();
    
    return data.map((activity: PolarActivityResponse) => ({
      id: crypto.randomUUID(),
      userId,
      date: new Date(activity.date),
      calories: activity.calories,
      heartRateAvg: activity.heart_rate_avg,
      heartRateMax: activity.heart_rate_max,
      duration: activity.duration,
      sleepScore: activity.sleep_score,
      nightlyRecharge: activity.nightly_recharge,
    }));
  }

  async getSleep(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarSleep[]> {
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);
    
    const response = await fetch(
      `${POLAR_API_BASE}/users/${userId}/sleep/${start}/${end}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Polar sleep');
    }

    const data = await response.json();
    
    return data.map((sleep: PolarSleepResponse) => ({
      id: crypto.randomUUID(),
      userId,
      date: new Date(sleep.date),
      sleepDuration: sleep.sleep_duration,
      sleepScore: sleep.sleep_score,
      deepSleep: sleep.deep_sleep,
      remSleep: sleep.rem_sleep,
      lightSleep: sleep.light_sleep,
    }));
  }

  async getDailyActivity(userId: string, accessToken: string, date: Date): Promise<PolarDailyActivity> {
    const dateStr = this.formatDate(date);
    
    const response = await fetch(
      `${POLAR_API_BASE}/users/${userId}/activity-log/${dateStr}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Polar daily activity');
    }

    const data: PolarDailyActivityResponse = await response.json();
    
    return {
      id: crypto.randomUUID(),
      userId,
      date,
      steps: data.steps,
      calories: data.calories,
      activeMinutes: data.active_minutes,
      heartRateVariability: data.heart_rate_variability,
    };
  }
}
