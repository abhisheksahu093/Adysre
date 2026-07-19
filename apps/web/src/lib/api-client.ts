import { createApiClient } from '@adysre/sdk';

/** Browser-side API client. Sends HTTP-only auth cookies with every request. */
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  headers: { 'x-tenant-slug': 'demo' },
});
