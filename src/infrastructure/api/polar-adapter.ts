import { PolarPort } from '../../domain/interfaces/polar-port';
import { PolarActivity, PolarSleep, PolarDailyActivity } from '../../domain/entities/polar-data';
import { PolarConfig, createPolarConfig } from './polar/config';
import { HttpClient, FetchHttpClient } from './polar/http-client';
import { PolarOAuthClient } from './polar/oauth-client';
import { PolarDataMapper } from './polar/data-mapper';

export class PolarAdapter implements PolarPort {
  private readonly oauthClient: PolarOAuthClient;
  private readonly dataMapper: PolarDataMapper;

  constructor(
    config?: PolarConfig,
    httpClient?: HttpClient
  ) {
    const resolvedConfig = config ?? createPolarConfig();
    const resolvedHttpClient = httpClient ?? new FetchHttpClient();

    this.oauthClient = new PolarOAuthClient(resolvedConfig, resolvedHttpClient);
    this.dataMapper = new PolarDataMapper();
  }

  getAuthorizationUrl(): string {
    return this.oauthClient.getAuthorizationUrl();
  }

  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }> {
    return this.oauthClient.exchangeCodeForToken(code);
  }

  async getActivities(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarActivity[]> {
    const start = this.dataMapper.formatDate(startDate);
    const end = this.dataMapper.formatDate(endDate);

    const response = await fetch(
      `https://polaraccesslink.com/v3/users/${userId}/activity-samples/${start}/${end}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch Polar activities: ${response.status} ${body}`);
    }

    const data = await response.json();
    return data.map((activity: unknown) =>
      this.dataMapper.toActivity(activity, userId)
    );
  }

  async getSleep(userId: string, accessToken: string, startDate: Date, endDate: Date): Promise<PolarSleep[]> {
    const start = this.dataMapper.formatDate(startDate);
    const end = this.dataMapper.formatDate(endDate);

    const response = await fetch(
      `https://polaraccesslink.com/v3/users/${userId}/sleep/${start}/${end}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch Polar sleep: ${response.status} ${body}`);
    }

    const data = await response.json();
    return data.map((sleep: unknown) =>
      this.dataMapper.toSleep(sleep, userId)
    );
  }

  async getDailyActivity(userId: string, accessToken: string, date: Date): Promise<PolarDailyActivity> {
    const dateStr = this.dataMapper.formatDate(date);

    const response = await fetch(
      `https://polaraccesslink.com/v3/users/${userId}/activity-log/${dateStr}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Polar daily activity');
    }

    const data = await response.json();
    return this.dataMapper.toDailyActivity(data, userId, date);
  }
}