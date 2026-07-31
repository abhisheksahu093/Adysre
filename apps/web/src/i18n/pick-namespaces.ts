import type { AbstractIntlMessages } from 'next-intl';

/**
 * Copies out the named top-level namespaces from a message catalogue.
 *
 * Split from `client-messages.tsx` so it can be unit-tested without React or a
 * request: it is the piece that decides what reaches the browser, and getting
 * it wrong shows up as a page rendering `landing.hero.title` at a visitor
 * rather than as anything a build or a type-check would catch.
 *
 * Top-level only, deliberately: a nested selector such as `landing.install`
 * would need the parent object rebuilt around it for one leaf, and the saving
 * over taking `landing` whole is not worth a second, subtler way for a route to
 * end up missing a message.
 */
export function pickNamespaces(
  messages: AbstractIntlMessages,
  namespaces: readonly string[],
): AbstractIntlMessages {
  const picked: AbstractIntlMessages = {};
  for (const namespace of namespaces) {
    const value = messages[namespace];
    // A namespace named here but absent from the catalogue is silently skipped:
    // the caller gets the same "missing message" fallback it would get anyway,
    // rather than a crash on a page that renders fine in every other respect.
    if (value !== undefined) picked[namespace] = value;
  }
  return picked;
}
