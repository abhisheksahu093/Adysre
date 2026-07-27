import { spawn } from 'node:child_process';

/**
 * Runs the database tests against the DIRECT connection with a real pool.
 *
 * ─── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * `DATABASE_URL` points at the pooler with `connection_limit=1`, which is the
 * correct production setting: serverless scales to many short-lived instances,
 * and each one holding several connections exhausts the server long before
 * traffic does.
 *
 * It is the wrong setting for a test run. Several of these tests assert
 * atomicity by firing twenty queries at once, and twenty queries through one
 * connection queue until Prisma's pool acquisition times out. The failure
 * arrives as "Can't reach database server", which reads like an outage and is
 * really self-inflicted contention.
 *
 * So tests use the direct connection (no pgbouncer) with room for the
 * concurrency they deliberately create. The application still uses the pooled
 * URL everywhere else.
 */

const direct = process.env.TEST_DATABASE_URL ?? process.env.DIRECT_URL;

if (!direct) {
  console.error(
    'db-test: neither TEST_DATABASE_URL nor DIRECT_URL is set.\n' +
      'Load the environment first, e.g.  set -a; . ./.env; set +a',
  );
  process.exit(1);
}

/**
 * Enough connections for the parallel assertions, and no more.
 *
 * Supabase's session-mode port allows 15 clients IN TOTAL across everything
 * connected, including a running dev server. Asking for ten here left too few
 * and the pooler answered `EMAXCONNSESSION: max clients reached`, which Prisma
 * surfaces as "Can't reach database server" - the same message as the
 * one-connection starvation this script exists to fix, from the opposite cause.
 *
 * Five is comfortably above the concurrency any single test needs (they queue
 * on an advisory lock anyway) and well under the shared ceiling.
 */
const POOL = 5;
const url = new URL(direct);
url.searchParams.set('connection_limit', String(POOL));
// pgbouncer must be off here: these tests use advisory locks and interactive
// transactions, which a transaction-mode pooler cannot hold across statements.
url.searchParams.delete('pgbouncer');

const child = spawn(
  'tsx',
  ['--conditions=react-server', '--test', 'src/**/*.dbtest.ts', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, DATABASE_URL: url.toString() },
  },
);

child.on('exit', (code) => process.exit(code ?? 1));
