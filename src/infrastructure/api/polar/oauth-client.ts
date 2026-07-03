import { PolarConfig } from './config';
import { HttpClient } from './http-client';

interface TokenResponse {
  access_token: string;
}

interface UserResponse {
  'polar-user-id': string;
}

export class PolarOAuthClient {
  constructor(
    private readonly config: PolarConfig,
    private readonly httpClient: HttpClient
  ) {}

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'accesslink.read_all',
    });
    return `${this.config.authBaseUrl}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }> {
    const tokenResponse = await this.httpClient.post(
      `${this.config.authBaseUrl}/oauth/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
      })
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = (await tokenResponse.json()) as TokenResponse;

    const userResponse = await this.httpClient.post(
      `${this.config.apiBaseUrl}/users`,
      { 'member-id': crypto.randomUUID() },
      tokenData.access_token
    );

    if (!userResponse.ok) {
      throw new Error(`Failed to register Polar user: ${userResponse.status}`);
    }

    const userData = (await userResponse.json()) as UserResponse;

    return {
      accessToken: tokenData.access_token,
      userId: userData['polar-user-id'],
    };
  }
}