'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/toast/toaster';
import { RouteProgress } from '@/components/route-progress';

/**
 * Client-side providers: theme (light/dark/system) + TanStack Query, plus the
 * two pieces of global chrome that have to exist exactly once.
 *
 * The `Toaster` is mounted here rather than in a layout so there is exactly one
 * of it for marketing pages, the app shell and the auth pages alike - a second
 * viewport would split the queue and announce half the messages. `RouteProgress`
 * is here for the same reason, and because a navigation indicator that lived in
 * one layout would go blank on the navigations that leave it.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <RouteProgress />
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
