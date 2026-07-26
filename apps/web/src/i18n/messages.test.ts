import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { createTranslator } from 'next-intl';

/**
 * Message catalogue tests.
 *
 * Every string in `messages/*.json` is an ICU message, which means `{` is a
 * placeholder delimiter and not a character. A sentence that mentions the
 * module's own `{{variable}}` syntax therefore parses as a malformed argument
 * and throws AT RENDER TIME, in one component, in one dialog - the kind of
 * fault that ships because nothing type-checks a translation file.
 *
 * So this formats every message in every locale. It needs no browser and no
 * server: `createTranslator` is the same formatter the app uses.
 */

const here = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(here, '..', '..', 'messages');
const LOCALES = ['en', 'hi', 'ja', 'zh'] as const;

type Catalogue = { [key: string]: string | Catalogue };

function load(locale: string): Catalogue {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf8')) as Catalogue;
}

/** Every leaf key path in a catalogue, dot separated. */
function leafKeys(catalogue: Catalogue, prefix = ''): string[] {
  return Object.entries(catalogue).flatMap(([key, value]) =>
    typeof value === 'string'
      ? [`${prefix}${key}`]
      : leafKeys(value, `${prefix}${key}.`),
  );
}

/**
 * Values for whatever placeholders a message declares.
 *
 * Read out of the message itself rather than listed by hand, which would be a
 * second catalogue to keep in step with the first. `1` is used for every one
 * because it formats as a string, satisfies a plural, and falls to `other` in a
 * select - the point here is that the message PARSES and formats, not what it
 * renders.
 */
function valuesFor(message: string): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const match of message.matchAll(/\{\s*([A-Za-z0-9_]+)/g)) {
    if (match[1]) values[match[1]] = 1;
  }

  // Rich-text tags (`<b>`, `<a>`) are values too: next-intl expects a render
  // function per tag, and a message using one is otherwise reported as a
  // missing variable rather than as the valid message it is.
  for (const match of message.matchAll(/<([A-Za-z][A-Za-z0-9]*)>/g)) {
    if (match[1]) values[match[1]] = (chunks: unknown) => chunks;
  }

  return values;
}

/** Read a leaf by its dotted path. */
function messageAt(catalogue: Catalogue, key: string): string {
  return key
    .split('.')
    .reduce<string | Catalogue>((node, part) => (node as Catalogue)[part]!, catalogue) as string;
}

describe('message catalogues', () => {
  for (const locale of LOCALES) {
    it(`formats every message in ${locale}`, () => {
      const messages = load(locale);
      const failures: string[] = [];

      const translate = createTranslator({
        locale,
        messages,
        onError: (error) => failures.push(error.message),
      });

      for (const key of leafKeys(messages)) {
        // `t` reports through `onError` rather than throwing, so one bad
        // message does not hide the rest of the catalogue.
        translate(key as never, valuesFor(messageAt(messages, key)) as never);
      }

      assert.deepEqual(failures, [], `${locale}: ${failures.slice(0, 3).join(' | ')}`);
    });
  }

  it('keeps the four catalogues on identical keys', () => {
    const reference = leafKeys(load('en')).sort();

    for (const locale of LOCALES.slice(1)) {
      const keys = leafKeys(load(locale)).sort();
      assert.deepEqual(
        keys.filter((key) => !reference.includes(key)),
        [],
        `${locale} has keys en does not`,
      );
      assert.deepEqual(
        reference.filter((key) => !keys.includes(key)),
        [],
        `${locale} is missing keys en has`,
      );
    }
  });

  it('escapes the module’s own {{variable}} syntax where a message mentions it', () => {
    // ICU quoting: '{{name}}' renders the braces literally. An unquoted one is
    // the exact fault this file exists to catch.
    for (const locale of LOCALES) {
      const messages = load(locale);
      for (const key of leafKeys(messages)) {
        const value = messageAt(messages, key);
        if (!value.includes('{{')) continue;
        assert.ok(
          /'\{\{[^}]*\}\}'/.test(value),
          `${locale}.${key} mentions {{...}} without ICU quoting: ${value}`,
        );
      }
    }
  });
});
