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
  /**
   * `fetch` replacement, for callers that need to react to the response before
   * the client sees it.
   *
   * The same-origin client passes one that recovers from an expired access
   * token by refreshing and retrying once. That has to happen at the transport
   * layer: by the time `request` has read the body, the 401 is already an
   * `ApiClientError` and the caller has no way to tell "your session lapsed"
   * apart from "you may not do this".
   */
  fetchImpl?: (input: string, init?: RequestInit) => Promise<Response>;
}

export class ApiClient {
  constructor(private readonly opts: ApiClientOptions) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const doFetch = this.opts.fetchImpl ?? fetch;
    const res = await doFetch(`${this.opts.baseUrl}${path}`, {
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
