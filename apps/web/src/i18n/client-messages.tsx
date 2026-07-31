import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { pickNamespaces } from './pick-namespaces';

/**
 * Which translations get serialised into the HTML, per route.
 *
 * ─── The problem this solves ────────────────────────────────────────────────
 * `NextIntlClientProvider` with no `messages` prop takes the WHOLE catalogue
 * from the server config and serialises it into the RSC payload, because it has
 * no way to know which of it the client will ask for. On this app that is 104 KB
 * of JSON on every single page: a fifth of the home page's 506 KB, and none of
 * it needed by the landing page, which uses eleven of the thirty-four
 * namespaces. It costs bytes on the wire, parse time on the main thread before
 * anything is interactive, and it is the single largest thing in the document.
 *
 * ─── How the scoping works ──────────────────────────────────────────────────
 * The root layout provides only what the chrome it renders itself needs. Every
 * route tree then declares its own set, and the innermost provider wins:
 * `messages` given explicitly REPLACES the inherited value rather than merging
 * with it (see `IntlProvider` in use-intl), so a scoped provider must name
 * everything its subtree uses, not just the extra.
 *
 * ─── Which set to use ───────────────────────────────────────────────────────
 * `<ScopedMessages>` for a public page whose weight matters, where the
 * namespaces can be enumerated and reviewed. `<FullMessages>` everywhere else:
 * the signed-in app reaches across most of the catalogue anyway, and a missing
 * namespace there is a broken screen for the sake of a few KB nobody measures.
 *
 * ─── If you see `namespace.key` rendered literally ──────────────────────────
 * That is next-intl's fallback for a message it cannot resolve, and on a scoped
 * route it means the namespace is missing from the list. Add it to the route's
 * `namespaces`; do not switch the route to `<FullMessages>` to make it go away.
 *
 * Only CLIENT components need a namespace listed here. Server Components
 * resolve their translations during the render and ship the resulting strings,
 * never the catalogue.
 */

/**
 * What the root layout's own client chrome uses.
 *
 * `Toaster` (mounted in `providers.tsx` for every route) is the only client
 * component the root layout renders that reads a translation.
 */
export const ROOT_CLIENT_NAMESPACES = ['toast'] as const;

/** Ships only the named namespaces to the client. */
export async function ScopedMessages({
  namespaces,
  children,
}: {
  namespaces: readonly string[];
  children: ReactNode;
}) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={pickNamespaces(messages, namespaces)}>
      {children}
    </NextIntlClientProvider>
  );
}

/** Ships the whole catalogue, for route trees that are not weight-sensitive. */
export async function FullMessages({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
