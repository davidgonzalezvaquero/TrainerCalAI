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
    });
    return `${this.config.authBaseUrl}/oauth2/authorization?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }> {
    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString('base64');

    const tokenResponse = await this.httpClient.postForm(
      `${this.config.apiBaseUrl}/oauth2/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
      }),
      undefined,
      credentials
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Polar token exchange failed:', tokenResponse.status, errorText);
      throw new Error(`Failed to exchange code for token: ${tokenResponse.status} ${errorText}`);
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