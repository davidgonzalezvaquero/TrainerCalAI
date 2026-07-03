export interface HttpResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export interface HttpClient {
  get(path: string, token?: string): Promise<HttpResponse>;
  post(path: string, body: unknown, token?: string): Promise<HttpResponse>;
}

export class FetchHttpClient implements HttpClient {
  async get(path: string, token?: string): Promise<HttpResponse> {
    return fetch(path, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async post(path: string, body: unknown, token?: string): Promise<HttpResponse> {
    return fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  }
}