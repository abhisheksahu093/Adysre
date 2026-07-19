/**
 * Typed API client for ADYSRE. Wraps fetch, sends credentials (HTTP-only auth
 * cookies), and unwraps the standard `{ success, data }` envelope.
 */
import type {
  ApiResponse,
  Paginated,
  OrganizationDto,
  UserDto,
  NotificationDto,
} from '@adysre/types';

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  /** Extra headers (e.g. server-side forwarded cookies). */
  headers?: Record<string, string>;
}

export class ApiClient {
  constructor(private readonly opts: ApiClientOptions) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...this.opts.headers,
        ...init?.headers,
      },
    });

    const body = (await res.json()) as ApiResponse<T>;
    if (!body.success) {
      throw new ApiClientError(body.code, body.message, res.status);
    }
    return body.data;
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }
  post<T>(path: string, data?: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(data ?? {}) });
  }
  patch<T>(path: string, data?: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(data ?? {}) });
  }
  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }

  // ---- Resource helpers ----
  get me() {
    return {
      profile: () => this.get<UserDto>('/me'),
      organization: () => this.get<OrganizationDto>('/me/organization'),
      notifications: () => this.get<Paginated<NotificationDto>>('/me/notifications'),
    };
  }
}

export function createApiClient(opts: ApiClientOptions) {
  return new ApiClient(opts);
}
