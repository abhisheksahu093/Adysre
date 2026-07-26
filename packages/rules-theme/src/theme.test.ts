import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  AA_LARGE,
  AA_NORMAL,
  auditReport,
  auditTheme,
  contrastRatio,
  CONTRAST_PAIRS,
  createRulesTheme,
  darkTokens,
  incompleteTokens,
  lightRulesTheme,
  lightTokens,
  luminance,
  meetsAA,
  missingTokens,
  parseColor,
  RULES_TOKENS,
  themeStyle,
} from './index.ts';

/**
 * A theme, checked rather than claimed.
 *
 * "WCAG AA" is otherwise a sentence in a pull request. It is arithmetic, so
 * these assert it - and the two shipped themes are held to the same audit a
 * host would run on its own, which is the only way the default can be trusted
 * to be the accessible one.
 */

describe('reading a colour', () => {
  it('reads the forms a token is written in', () => {
    assert.deepEqual(parseColor('#fff'), { r: 255, g: 255, b: 255 });
    assert.deepEqual(parseColor('#ffffff'), { r: 255, g: 255, b: 255 });
    assert.deepEqual(parseColor('#000000'), { r: 0, g: 0, b: 0 });
    assert.deepEqual(parseColor('  #2563eb '), { r: 37, g: 99, b: 235 });
    assert.deepEqual(parseColor('rgb(37 99 235)'), { r: 37, g: 99, b: 235 });
    assert.deepEqual(parseColor('rgba(37, 99, 235, 0.5)'), { r: 37, g: 99, b: 235 });
  });

  it('refuses what it cannot read rather than guessing', () => {
    // An audit that quietly skipped what it could not parse would be an audit
    // that always passes.
    assert.equal(parseColor('var(--brand)'), undefined);
    assert.equal(parseColor('oklch(0.7 0.1 200)'), undefined);
    assert.equal(parseColor('transparent'), undefined);
    assert.equal(parseColor('#12'), undefined);
    assert.equal(parseColor(''), undefined);
  });

  it('ignores alpha rather than compositing it', () => {
    // What a translucent colour reads as depends on what is behind it, and
    // assuming white is how an audit passes a theme that fails on a dark page.
    assert.deepEqual(parseColor('#2563eb80'), { r: 37, g: 99, b: 235 });
  });
});

describe('contrast', () => {
  it('agrees with the two ratios everybody knows', () => {
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };

    assert.equal(Math.round(contrastRatio(black, white)), 21);
    assert.equal(contrastRatio(white, white), 1);
    assert.equal(luminance(white), 1);
    assert.equal(luminance(black), 0);
  });

  it('is the same either way round', () => {
    const a = { r: 37, g: 99, b: 235 };
    const b = { r: 255, g: 255, b: 255 };

    assert.equal(contrastRatio(a, b), contrastRatio(b, a));
  });

  it('holds body text to 4.5 and interface parts to 3', () => {
    assert.equal(AA_NORMAL, 4.5);
    assert.equal(AA_LARGE, 3);
    assert.ok(meetsAA(4.5));
    assert.ok(!meetsAA(4.49));
    assert.ok(meetsAA(3, 'large'));
    assert.ok(!meetsAA(2.99, 'large'));
  });
});

describe('the shipped themes', () => {
  it('passes its own audit in light', () => {
    const audit = auditTheme(lightTokens);
    assert.equal(auditReport(audit), '', 'contrast failures');
    assert.ok(audit.passes);
  });

  it('passes its own audit in dark', () => {
    const audit = auditTheme(darkTokens);
    assert.equal(auditReport(audit), '', 'contrast failures');
    assert.ok(audit.passes);
  });

  it('checks every pair, and leaves nothing unchecked', () => {
    const audit = auditTheme(lightTokens);

    assert.equal(audit.findings.length, CONTRAST_PAIRS.length);
    assert.deepEqual(audit.unchecked, []);
  });

  it('defines every token the builder draws with', () => {
    assert.deepEqual(missingTokens(lightTokens), []);
    assert.deepEqual(missingTokens(darkTokens), []);
    assert.deepEqual(incompleteTokens(lightRulesTheme), []);
  });
});

describe('the audit is capable of failing', () => {
  it('catches a brand palette used as body text', () => {
    // The whole reason the defaults are not the raw brand colours: amber reads
    // beautifully as a filled badge and sits near 2:1 as a sentence.
    const audit = auditTheme({ ...lightTokens, warning: '#f59e0b', success: '#22c55e' });

    assert.ok(!audit.passes);
    assert.ok(auditReport(audit).includes('warning on card'));
    assert.ok(auditReport(audit).includes('success on card'));
  });

  it('says what was not checked instead of passing it', () => {
    const audit = auditTheme({ ...lightTokens, accent: 'var(--brand-accent)' });

    assert.deepEqual(audit.unchecked, ['accent']);
    // The pair involving it is absent from the findings rather than counted as
    // a pass, so a host reading `passes` is not being told something untrue.
    assert.ok(audit.findings.every((finding) => finding.pair.foreground !== 'accent'));
  });

  it('reports a failure somebody can act on', () => {
    const audit = auditTheme({ ...lightTokens, foreground: '#cccccc' });
    const report = auditReport(audit);

    assert.ok(report.includes('body text'), 'the report names where it is on screen');
    assert.ok(/\d\.\d\d:1/.test(report), 'and the ratio it got');
    assert.ok(report.includes('needs 4.5:1'));
  });
});

describe('making a theme', () => {
  it('fills the gaps from a base, so a partial theme is a real one', () => {
    const theme = createRulesTheme({ id: 'brand', tokens: { primary: '#7c3aed' } });

    assert.equal(theme.tokens['primary'], '#7c3aed');
    assert.equal(theme.tokens['background'], lightTokens.background);
    assert.deepEqual(incompleteTokens(theme), []);
  });

  it('refuses a token this build has no name for, at construction', () => {
    // A typo in a theme is a programming error, and the moment to find it is
    // when the theme is declared rather than when one panel looks wrong.
    assert.throws(
      () => createRulesTheme({ id: 'typo', tokens: { forground: '#000' } as never }),
      /forground/,
    );
  });

  it('builds on dark when asked', () => {
    const theme = createRulesTheme({ id: 'night', base: darkTokens, tokens: {} });
    assert.equal(theme.tokens['background'], darkTokens.background);
  });

  it('carries a className for a host that styles by class', () => {
    assert.equal(
      createRulesTheme({ id: 'x', tokens: {}, className: 'rules-x' }).className,
      'rules-x',
    );
  });
});

describe('applying a theme', () => {
  it('is custom properties a component can wear directly', () => {
    const style = themeStyle(lightRulesTheme);

    assert.equal(style['--background'], '#ffffff');
    assert.equal(style['--muted-foreground'], lightTokens['muted-foreground']);
    assert.equal(Object.keys(style).length, RULES_TOKENS.length);
    // Every key is a custom property, so React takes the record as `style`.
    assert.ok(Object.keys(style).every((key) => key.startsWith('--')));
  });
});

describe('the stylesheet and the themes agree', () => {
  /**
   * `tokens.css` restates what `themes.ts` holds, because a stylesheet cannot
   * import a TypeScript record. Two copies of the same values is exactly the
   * drift a reader would never notice - the audit would keep passing against
   * the TS set while the CSS a host actually loads had gone stale.
   */
  const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'tokens.css'), 'utf8');

  /** The declarations inside the first block matching a selector. */
  function block(selector: string): Record<string, string> {
    const start = css.indexOf(selector);
    assert.ok(start >= 0, `no ${selector} block in tokens.css`);

    const open = css.indexOf('{', start);
    const close = css.indexOf('}', open);
    const declarations: Record<string, string> = {};

    for (const line of css.slice(open + 1, close).split('\n')) {
      const match = /^\s*--([a-z-]+)\s*:\s*([^;]+);/.exec(line);
      if (match?.[1] !== undefined && match[2] !== undefined) {
        declarations[match[1]] = match[2].trim();
      }
    }

    return declarations;
  }

  it('ships the light theme it was audited on', () => {
    const declared = block(':root');
    for (const token of RULES_TOKENS) {
      assert.equal(declared[token], lightTokens[token], `--${token} has drifted`);
    }
  });

  it('ships the dark theme it was audited on', () => {
    const declared = block('.dark,');
    for (const token of RULES_TOKENS) {
      assert.equal(declared[token], darkTokens[token], `--${token} has drifted in dark`);
    }
  });

  it('repeats the dark values for a visitor who never touched a toggle', () => {
    // The media-query block is a third copy, and the one most likely to be
    // forgotten: a class-only dark theme renders a white panel inside a host
    // that follows the system setting.
    const declared = block(':root:not(.light)');
    for (const token of RULES_TOKENS) {
      assert.equal(declared[token], darkTokens[token], `--${token} has drifted in the media query`);
    }
  });
});
