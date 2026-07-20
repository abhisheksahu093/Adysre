/**
 * Audience / social-proof figures.
 *
 * These are MARKETING metrics with no data source behind them (unlike the
 * content counts in `@/data/library-stats`, which derive from the real
 * catalogues). They live here as the single place to edit them, and because
 * this module imports no data it is safe to pull into client components without
 * bundling any catalogue. Numbers are plain values, formatted per locale at
 * render time so digit grouping stays correct in every language.
 */

/** Teams building on ADYSRE - shown in the landing stats band. */
export const TRUSTED_TEAMS = 18_000;

/** Builders trusted - the landing hero trust line. */
export const TRUSTED_BUILDERS = 18_000;

/** Users trusted - the sidebar All-Access promo card. */
export const TRUSTED_USERS = 120_000;
