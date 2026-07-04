export interface HttpResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
  text(): Promise<string>;
}

export interface HttpClient {
  get(path: string, token?: string): Promise<HttpResponse>;
  post(path: string, body: unknown, token?: string): Promise<HttpResponse>;
  postForm(path: string, body: URLSearchParams, token?: string, basicAuth?: string): Promise<HttpResponse>;
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

  async postForm(
    path: string,
    body: URLSearchParams,
    tokenOrBasic?: string,
    basicAuth?: string
  ): Promise<HttpResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json;charset=UTF-8',
    };

    if (basicAuth) {
      headers['Authorization'] = `Basic ${basicAuth}`;
    } else if (tokenOrBasic) {
      headers['Authorization'] = `Bearer ${tokenOrBasic}`;
    }

    return fetch(path, {
      method: 'POST',
      headers,
      body: body.toString(),
    });
  }
}