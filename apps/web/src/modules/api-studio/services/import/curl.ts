/**
 * ADYSRE API Studio - importing a cURL command.
 *
 * The most common way a request arrives: copied out of a browser's network
 * panel, a colleague's message or a vendor's documentation. So the parser is
 * forgiving about the shapes those produce - line continuations, single or
 * double quotes, `$'...'` from bash, flags in either short or long form - and
 * refuses to guess only where guessing would send the wrong request.
 *
 * Pure, and deliberately not a shell: it tokenises quotes and escapes, and does
 * NOT expand variables, run substitutions or evaluate anything. A pasted
 * `$(rm -rf /)` is text here, and stays text.
 */

import type { KeyValueEntry, RequestBody, RequestDefinition } from '../../types';
import { HTTP_METHODS } from '../../types';
import { EMPTY_REQUEST } from '../../constants/defaults';
import { createEntry } from '../../utils/entries';
import { paramsFromUrl, pathVariablesFromUrl } from '../../utils/url';

export type CurlImport =
  | { ok: true; request: RequestDefinition; warnings: string[] }
  | { ok: false; reason: string };

/**
 * Split a command into arguments the way a shell would, minus the dangerous
 * parts. Quotes group, backslash escapes, and `$'...'` is decoded.
 *
 * The `$'...'` form matters more than it looks: it is what Chrome emits for any
 * header containing a non-ASCII character, and it is ANSI-C quoting, where
 * `\u00e9` MEANS `é`. Passing it through literally would import a header whose
 * value is the six characters of the escape, and send that instead.
 */
export function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  /** True while inside a `$'...'` string, where escapes are decoded. */
  let ansiC = false;
  let started = false;

  for (let index = 0; index < command.length; index += 1) {
    const char = command[index]!;

    if (quote === null && (char === ' ' || char === '\t' || char === '\n' || char === '\r')) {
      if (started) {
        tokens.push(current);
        current = '';
        started = false;
      }
      continue;
    }

    // Inside `$'...'`, a backslash introduces an escape the shell decodes.
    if (char === '\\' && ansiC && quote === "'") {
      const decoded = decodeAnsiC(command, index + 1);
      current += decoded.value;
      index = decoded.next - 1;
      started = true;
      continue;
    }

    // A backslash before a newline is a line continuation, which every
    // multi-line copy-paste contains.
    if (char === '\\' && quote !== "'") {
      const next = command[index + 1];
      if (next === '\n' || next === '\r') {
        index += next === '\r' && command[index + 2] === '\n' ? 2 : 1;
        continue;
      }
      if (next !== undefined) {
        current += next;
        started = true;
        index += 1;
        continue;
      }
    }

    if (quote === null && (char === '"' || char === "'")) {
      // `$'...'` is bash's escaped-string form; the `$` is not part of the value.
      if (char === "'" && current.endsWith('$')) {
        current = current.slice(0, -1);
        ansiC = true;
      }
      quote = char;
      started = true;
      continue;
    }

    if (char === quote) {
      quote = null;
      ansiC = false;
      continue;
    }

    current += char;
    started = true;
  }

  if (started) tokens.push(current);
  return tokens;
}

/**
 * Decode one ANSI-C escape, starting at the character AFTER the backslash.
 *
 * @returns the decoded text and the index to continue from. An escape this does
 * not know keeps its backslash, which is what bash does too.
 */
function decodeAnsiC(source: string, start: number): { value: string; next: number } {
  const char = source[start];
  if (char === undefined) return { value: '\\', next: start };

  const simple: Record<string, string> = {
    n: '\n',
    t: '\t',
    r: '\r',
    a: '\u0007',
    b: '\b',
    f: '\f',
    v: '\v',
    e: '\u001b',
    '\\': '\\',
    "'": "'",
    '"': '"',
    '?': '?',
  };

  if (simple[char] !== undefined) return { value: simple[char], next: start + 1 };

  if (char === 'x') {
    const hex = /^[0-9a-fA-F]{1,2}/.exec(source.slice(start + 1, start + 3))?.[0];
    if (hex) return { value: String.fromCharCode(Number.parseInt(hex, 16)), next: start + 1 + hex.length };
  }

  if (char === 'u' || char === 'U') {
    const width = char === 'u' ? 4 : 8;
    const hex = new RegExp(`^[0-9a-fA-F]{1,${width}}`).exec(
      source.slice(start + 1, start + 1 + width),
    )?.[0];
    if (hex) {
      return { value: String.fromCodePoint(Number.parseInt(hex, 16)), next: start + 1 + hex.length };
    }
  }

  const octal = /^[0-7]{1,3}/.exec(source.slice(start))?.[0];
  if (octal) return { value: String.fromCharCode(Number.parseInt(octal, 8)), next: start + octal.length };

  return { value: `\\${char}`, next: start + 1 };
}

/** Flags that take a value, in the forms people paste. */
const VALUE_FLAGS = new Set([
  '-H', '--header',
  '-X', '--request',
  '-d', '--data', '--data-raw', '--data-binary', '--data-ascii', '--data-urlencode',
  '-F', '--form',
  '-u', '--user',
  '-b', '--cookie',
  '-A', '--user-agent',
  '-e', '--referer',
  '--url',
  '--max-time', '--connect-timeout',
  '-o', '--output',
  '-m',
]);

/** Flags that are meaningful to a request and are handled below. */
const KNOWN_BOOLEAN_FLAGS = new Set([
  '-k', '--insecure',
  '-L', '--location',
  '-G', '--get',
  '-I', '--head',
  '-s', '--silent', '-v', '--verbose', '-i', '--include', '--compressed', '-f', '--fail',
]);

export function importCurl(command: string): CurlImport {
  const tokens = tokenize(command.trim());
  if (tokens.length === 0) return { ok: false, reason: 'The command is empty.' };
  if (!/^curl$/i.test(tokens[0] ?? '') && !tokens.includes('curl')) {
    return { ok: false, reason: 'That does not look like a cURL command.' };
  }

  const warnings: string[] = [];
  const headers: KeyValueEntry[] = [];
  const formFields: KeyValueEntry[] = [];
  const dataParts: string[] = [];

  let url = '';
  let method: string | null = null;
  let user: string | null = null;
  let insecure = false;
  let followRedirects = false;
  let forceGet = false;
  let timeoutSeconds: number | null = null;

  const start = tokens.findIndex((token) => /^curl$/i.test(token));
  for (let index = start + 1; index < tokens.length; index += 1) {
    const token = tokens[index]!;

    if (!token.startsWith('-')) {
      // A bare argument is the URL. The first one wins; cURL allows several,
      // but a request has one address and quietly picking the last would be
      // the kind of surprise that costs an hour.
      if (url === '') url = token;
      else warnings.push(`Ignored an extra URL: ${token}`);
      continue;
    }

    // `-H=value` and `--header=value` both appear in the wild.
    const equals = token.indexOf('=');
    const flag = equals !== -1 && token.startsWith('--') ? token.slice(0, equals) : token;
    const inlineValue = equals !== -1 && token.startsWith('--') ? token.slice(equals + 1) : null;

    const takesValue = VALUE_FLAGS.has(flag);
    const value = takesValue ? (inlineValue ?? tokens[++index] ?? '') : '';

    switch (flag) {
      case '-H':
      case '--header': {
        const colon = value.indexOf(':');
        if (colon === -1) {
          warnings.push(`Ignored a header with no colon: ${value}`);
          break;
        }
        headers.push(
          createEntry({ key: value.slice(0, colon).trim(), value: value.slice(colon + 1).trim() }),
        );
        break;
      }

      case '-X':
      case '--request':
        method = value.toUpperCase();
        break;

      case '-d':
      case '--data':
      case '--data-raw':
      case '--data-binary':
      case '--data-ascii':
      case '--data-urlencode':
        dataParts.push(value);
        break;

      case '-F':
      case '--form': {
        const split = value.indexOf('=');
        if (split === -1) {
          warnings.push(`Ignored a form field with no value: ${value}`);
          break;
        }
        const fieldValue = value.slice(split + 1);
        if (fieldValue.startsWith('@')) {
          // The file is on the machine that ran the command, not here.
          warnings.push(`The file upload ${fieldValue} could not be imported.`);
        }
        formFields.push(createEntry({ key: value.slice(0, split), value: fieldValue }));
        break;
      }

      case '-u':
      case '--user':
        user = value;
        break;

      case '-b':
      case '--cookie':
        headers.push(createEntry({ key: 'Cookie', value }));
        break;

      case '-A':
      case '--user-agent':
        headers.push(createEntry({ key: 'User-Agent', value }));
        break;

      case '-e':
      case '--referer':
        headers.push(createEntry({ key: 'Referer', value }));
        break;

      case '--url':
        url = value;
        break;

      case '-k':
      case '--insecure':
        insecure = true;
        break;

      case '-L':
      case '--location':
        followRedirects = true;
        break;

      case '-G':
      case '--get':
        forceGet = true;
        break;

      case '-I':
      case '--head':
        method = 'HEAD';
        break;

      case '-m':
      case '--max-time':
      case '--connect-timeout': {
        const seconds = Number(value);
        if (!Number.isNaN(seconds) && seconds > 0) timeoutSeconds = seconds;
        break;
      }

      default:
        if (!KNOWN_BOOLEAN_FLAGS.has(flag)) {
          // Named rather than swallowed: an unimported flag may be the reason
          // the request behaves differently here than it did in the terminal.
          warnings.push(`Ignored ${flag}.`);
          if (takesValue) index += 1;
        }
    }
  }

  if (url === '') return { ok: false, reason: 'The command has no URL.' };

  const body = buildBody(dataParts, formFields, headers, forceGet);
  const resolvedMethod =
    method ?? (body.type !== 'none' && !forceGet ? 'POST' : 'GET');

  if (!(HTTP_METHODS as readonly string[]).includes(resolvedMethod)) {
    return { ok: false, reason: `\`${resolvedMethod}\` is not an HTTP method.` };
  }

  // `-G` moves the data into the query string, which is the whole point of it.
  const finalUrl =
    forceGet && dataParts.length > 0
      ? `${url}${url.includes('?') ? '&' : '?'}${dataParts.join('&')}`
      : url;

  const request: RequestDefinition = {
    ...structuredClone(EMPTY_REQUEST),
    method: resolvedMethod as RequestDefinition['method'],
    url: finalUrl,
    headers: headers.filter((header) => header.key.toLowerCase() !== 'authorization' || !user),
    params: paramsFromUrl(finalUrl, []),
    pathVariables: pathVariablesFromUrl(finalUrl, []),
    body: forceGet ? { type: 'none' } : body,
    auth: user
      ? {
          type: 'basic',
          username: user.slice(0, user.indexOf(':') === -1 ? undefined : user.indexOf(':')),
          password: user.indexOf(':') === -1 ? '' : user.slice(user.indexOf(':') + 1),
        }
      : { type: 'inherit' },
    settings: {
      ...EMPTY_REQUEST.settings,
      verifyTls: !insecure,
      followRedirects,
      ...(timeoutSeconds ? { timeoutMs: Math.min(timeoutSeconds * 1_000, 300_000) } : {}),
    },
  };

  return { ok: true, request, warnings };
}

/** Decide what the `-d` and `-F` parts add up to. */
function buildBody(
  dataParts: readonly string[],
  formFields: readonly KeyValueEntry[],
  headers: readonly KeyValueEntry[],
  forceGet: boolean,
): RequestBody {
  if (forceGet) return { type: 'none' };
  if (formFields.length > 0) {
    return {
      type: 'multipart',
      entries: formFields.map((field) => ({
        id: field.id,
        key: field.key,
        enabled: true,
        description: '',
        contentType: null,
        kind: 'text' as const,
        value: field.value,
      })),
    };
  }

  if (dataParts.length === 0) return { type: 'none' };

  // cURL joins repeated `-d` with `&`, which is what makes a form body.
  const content = dataParts.join('&');
  const declared = headers
    .find((header) => header.key.toLowerCase() === 'content-type')
    ?.value.toLowerCase();

  if (declared?.includes('x-www-form-urlencoded')) {
    return {
      type: 'urlencoded',
      entries: content.split('&').map((pair) => {
        const eq = pair.indexOf('=');
        return createEntry(
          eq === -1
            ? { key: decodeURIComponent(pair) }
            : {
                key: decodeURIComponent(pair.slice(0, eq)),
                value: decodeURIComponent(pair.slice(eq + 1)),
              },
        );
      }),
    };
  }

  const language = declared?.includes('xml')
    ? 'xml'
    : declared?.includes('html')
      ? 'html'
      : declared?.includes('json') || looksLikeJson(content)
        ? 'json'
        : 'text';

  return { type: 'raw', language, content };
}

function looksLikeJson(value: string): boolean {
  const trimmed = value.trim();
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  );
}
