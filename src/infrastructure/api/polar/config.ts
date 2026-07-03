export interface PolarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiBaseUrl: string;
  authBaseUrl: string;
}

export function createPolarConfig(overrides?: Partial<PolarConfig>): PolarConfig {
  const clientId = overrides?.clientId ?? process.env.POLAR_CLIENT_ID;
  const clientSecret = overrides?.clientSecret ?? process.env.POLAR_CLIENT_SECRET;
  const redirectUri = overrides?.redirectUri ?? process.env.POLAR_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing required Polar environment variables: POLAR_CLIENT_ID, POLAR_CLIENT_SECRET, POLAR_REDIRECT_URI');
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    apiBaseUrl: overrides?.apiBaseUrl ?? 'https://polaraccesslink.com/v3',
    authBaseUrl: overrides?.authBaseUrl ?? 'https://flow.polar.com',
  };
}