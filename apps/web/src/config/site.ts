/**
 * Site-wide constants that aren't content and aren't per-locale.
 *
 * SUPPORT_EMAIL is referenced by the profile menu, the pricing cards and the
 * FAQ. It lives here rather than in any one of them so those can't drift apart
 * - changing the address is a one-line edit.
 */
export const SUPPORT_EMAIL = 'support@adysre.com';

/** `mailto:` href for SUPPORT_EMAIL. */
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;
