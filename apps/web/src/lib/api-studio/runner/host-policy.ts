import { isIP } from 'node:net';

/**
 * Which addresses the runner may reach.
 *
 * This is the module's SSRF boundary, and it is unusual: for most servers the
 * answer is "never anything private", but an API client whose entire job is
 * testing `http://localhost:3000` cannot say that. So the policy is
 * DEPLOYMENT-CONFIGURED and defaults the safe way round: private ranges are
 * reachable on a developer's machine and refused in production unless an
 * operator opts in.
 *
 * Everything here decides on an IP ADDRESS, not a hostname. Hostname checks
 * alone are decoration: `evil.com` can resolve to `127.0.0.1`, and can resolve
 * differently on the second lookup than the first (DNS rebinding). The runner
 * therefore resolves the name itself and hands the resulting address here, then
 * connects to THAT address rather than looking it up again.
 */

export type HostVerdict =
  | { allowed: true }
  | { allowed: false; reason: 'loopback' | 'private' | 'link_local' | 'metadata' | 'reserved' };

export interface HostPolicy {
  /** Reach loopback (127.0.0.0/8, ::1). Localhost development. */
  allowLoopback: boolean;
  /** Reach RFC1918 and unique-local ranges. LAN and Docker development. */
  allowPrivate: boolean;
  /**
   * Reach link-local (169.254/16, fe80::/10). Off even when private ranges are
   * allowed, because that range holds the cloud metadata endpoint and nothing
   * a person means to test.
   */
  allowLinkLocal: boolean;
}

/** Cloud metadata addresses, refused under every configuration. */
const METADATA_ADDRESSES = new Set(['169.254.169.254', 'fd00:ec2::254', '100.100.100.200']);

/**
 * The policy for this deployment.
 *
 * `API_STUDIO_ALLOW_PRIVATE_HOSTS` opts a deployment in explicitly; without it,
 * production refuses private ranges and development allows them. An operator
 * who runs this behind a VPN to test internal services sets the flag and knows
 * why they set it.
 */
export function policyFromEnv(env: NodeJS.ProcessEnv = process.env): HostPolicy {
  const explicit = env.API_STUDIO_ALLOW_PRIVATE_HOSTS;
  const allow = explicit === 'true' ? true : explicit === 'false' ? false : env.NODE_ENV !== 'production';

  return { allowLoopback: allow, allowPrivate: allow, allowLinkLocal: false };
}

function ipv4Octets(address: string): number[] | null {
  const parts = address.split('.').map(Number);
  return parts.length === 4 && parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)
    ? parts
    : null;
}

/** Classify an IPv4 address. */
function classifyIpv4(address: string): HostVerdict {
  if (METADATA_ADDRESSES.has(address)) return { allowed: false, reason: 'metadata' };

  const octets = ipv4Octets(address);
  if (!octets) return { allowed: false, reason: 'reserved' };
  const [a, b] = octets as [number, number, number, number];

  if (a === 127) return { allowed: false, reason: 'loopback' };
  if (a === 169 && b === 254) return { allowed: false, reason: 'link_local' };
  if (a === 10) return { allowed: false, reason: 'private' };
  if (a === 172 && b >= 16 && b <= 31) return { allowed: false, reason: 'private' };
  if (a === 192 && b === 168) return { allowed: false, reason: 'private' };
  // Carrier-grade NAT, "this network", broadcast, multicast and the rest of the
  // reserved space: never a target anyone means to reach from here.
  if (a === 100 && b >= 64 && b <= 127) return { allowed: false, reason: 'private' };
  if (a === 0 || a >= 224) return { allowed: false, reason: 'reserved' };
  if (a === 192 && b === 0) return { allowed: false, reason: 'reserved' };
  if (a === 198 && (b === 18 || b === 19)) return { allowed: false, reason: 'reserved' };

  return { allowed: true };
}

/** Classify an IPv6 address, including IPv4-mapped forms. */
function classifyIpv6(address: string): HostVerdict {
  const lower = address.toLowerCase().replace(/^\[|\]$/g, '').split('%')[0] ?? '';
  if (METADATA_ADDRESSES.has(lower)) return { allowed: false, reason: 'metadata' };

  // ::ffff:127.0.0.1 is loopback wearing a different hat. Unwrap and re-check,
  // or the mapped form becomes a way around every rule below.
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(lower);
  if (mapped?.[1]) return classifyIpv4(mapped[1]);

  if (lower === '::1') return { allowed: false, reason: 'loopback' };
  if (lower === '::' || lower === '::0') return { allowed: false, reason: 'reserved' };
  if (/^fe[89ab]/.test(lower)) return { allowed: false, reason: 'link_local' };
  if (/^f[cd]/.test(lower)) return { allowed: false, reason: 'private' };
  if (/^ff/.test(lower)) return { allowed: false, reason: 'reserved' };

  return { allowed: true };
}

/**
 * Whether the runner may connect to an address under a policy.
 *
 * @param address - a literal IP, as resolved. Never a hostname.
 */
export function checkAddress(address: string, policy: HostPolicy): HostVerdict {
  const family = isIP(address);
  if (family === 0) return { allowed: false, reason: 'reserved' };

  const verdict = family === 4 ? classifyIpv4(address) : classifyIpv6(address);
  if (verdict.allowed) return verdict;

  switch (verdict.reason) {
    case 'loopback':
      return policy.allowLoopback ? { allowed: true } : verdict;
    case 'private':
      return policy.allowPrivate ? { allowed: true } : verdict;
    case 'link_local':
      return policy.allowLinkLocal ? { allowed: true } : verdict;
    // Metadata and reserved space are refused under every policy: there is no
    // configuration in which reaching the cloud metadata endpoint from a
    // user-supplied URL is the intent.
    default:
      return verdict;
  }
}

/**
 * Validate a URL's shape before anything is resolved or connected.
 *
 * Shape only: scheme, credentials and length. Whether the host may be reached
 * is decided later, on the resolved address.
 */
export function checkUrl(raw: string): { ok: true; url: URL } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: 'That is not a valid absolute URL.' };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, reason: 'Only http and https can be sent.' };
  }
  if (url.username !== '' || url.password !== '') {
    // Credentials in the URL are ambiguous with the auth tab and are a classic
    // way to disguise a host (`https://real.com@evil.com`).
    return { ok: false, reason: 'Put credentials in the auth tab, not the URL.' };
  }
  if (url.hostname === '') return { ok: false, reason: 'The URL has no host.' };

  return { ok: true, url };
}
