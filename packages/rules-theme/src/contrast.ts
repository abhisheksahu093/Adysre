import { RULES_TOKENS, type RulesToken, type RulesTokens } from './tokens.ts';

/**
 * Whether a theme can actually be read.
 *
 * The constitution asks for WCAG AA, and "AA" is otherwise a claim somebody
 * makes in a pull request. It is arithmetic, so it can be checked - and a theme
 * package that ships colours without checking them is the one place in the
 * system where an accessibility failure is guaranteed to be invisible to every
 * other test.
 *
 * What this does NOT do is guess. A token that is not a colour this can parse -
 * `var(--something)`, `oklch(...)`, a gradient - is REPORTED as unchecked
 * rather than assumed to pass. An audit that quietly skipped what it could not
 * read would be an audit that always passes.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** `#abc`, `#aabbcc`, `#aabbccff`, or `rgb(1 2 3)`. Anything else is `undefined`. */
export function parseColor(value: string): Rgb | undefined {
  const text = value.trim();

  if (text.startsWith('#')) {
    const hex = text.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      const [r, g, b] = [...hex.slice(0, 3)].map((digit) => Number.parseInt(digit + digit, 16));
      return r === undefined || g === undefined || b === undefined ? undefined : { r, g, b };
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = Number.parseInt(hex.slice(0, 2), 16);
      const g = Number.parseInt(hex.slice(2, 4), 16);
      const b = Number.parseInt(hex.slice(4, 6), 16);
      // Alpha is ignored rather than composited: what a translucent colour
      // reads as depends on what is behind it, and guessing white is how an
      // audit passes a theme that fails on a dark page.
      return [r, g, b].some(Number.isNaN) ? undefined : { r, g, b };
    }
    return undefined;
  }

  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(text);
  if (rgb === null) return undefined;

  return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
}

/** WCAG relative luminance. */
export function luminance(color: Rgb): number {
  const channel = (value: number): number => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : Math.pow((scaled + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

/** 1 for identical colours, 21 for black on white. */
export function contrastRatio(foreground: Rgb, background: Rgb): number {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

/** AA is 4.5:1 for body text and 3:1 for large text and interface parts. */
export const AA_NORMAL = 4.5;
export const AA_LARGE = 3;

export function meetsAA(ratio: number, size: 'normal' | 'large' = 'normal'): boolean {
  return ratio >= (size === 'large' ? AA_LARGE : AA_NORMAL);
}

export interface ContrastPair {
  foreground: RulesToken;
  background: RulesToken;
  size: 'normal' | 'large';
  /** Where the builder puts this combination, so a failure is findable. */
  where: string;
}

/**
 * The combinations the builder actually renders.
 *
 * Every one of these is a pair a component really produces - `text-danger` on a
 * card, `text-muted-foreground` on a muted panel - so a failure here is a
 * failure somebody can see on screen rather than a theoretical one between two
 * tokens that never meet.
 */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { foreground: 'foreground', background: 'background', size: 'normal', where: 'body text' },
  { foreground: 'foreground', background: 'card', size: 'normal', where: 'a condition row' },
  { foreground: 'card-foreground', background: 'card', size: 'normal', where: 'a card' },
  { foreground: 'muted-foreground', background: 'background', size: 'normal', where: 'hints' },
  { foreground: 'muted-foreground', background: 'card', size: 'normal', where: 'a row hint' },
  { foreground: 'muted-foreground', background: 'muted', size: 'normal', where: 'a group heading' },
  { foreground: 'danger', background: 'card', size: 'normal', where: 'a diagnostic' },
  { foreground: 'danger', background: 'background', size: 'normal', where: 'an error line' },
  { foreground: 'warning', background: 'card', size: 'normal', where: 'a warning' },
  { foreground: 'success', background: 'card', size: 'normal', where: 'a matched verdict' },
  { foreground: 'accent', background: 'card', size: 'normal', where: 'a variable in the preview' },
  {
    foreground: 'primary-foreground',
    background: 'primary',
    size: 'normal',
    where: 'the save button',
  },
  {
    foreground: 'secondary-foreground',
    background: 'secondary',
    size: 'normal',
    where: 'a secondary button',
  },
  {
    foreground: 'danger-foreground',
    background: 'danger',
    size: 'normal',
    where: 'a destructive button',
  },
  /*
   * Interface parts, which WCAG 1.4.11 holds to 3:1 rather than 4.5:1.
   *
   * `input` and `ring` are here because both carry information a person needs
   * to operate the thing: where a text box begins, and which control has focus.
   * The decorative `border` around a condition row is deliberately NOT audited -
   * a row is identified by what is written in it, and holding a subtle
   * separator to a control's standard would force every theme into heavy grey
   * outlines to satisfy a requirement that does not apply to it.
   */
  { foreground: 'input', background: 'background', size: 'large', where: 'a text box edge' },
  { foreground: 'ring', background: 'background', size: 'large', where: 'the focus ring' },
];

export interface ContrastFinding {
  pair: ContrastPair;
  ratio: number;
  required: number;
  passes: boolean;
}

export interface ThemeAudit {
  findings: ContrastFinding[];
  failures: ContrastFinding[];
  /** Tokens whose value this could not read, and therefore did not check. */
  unchecked: RulesToken[];
  passes: boolean;
}

/**
 * Check every pair the builder renders.
 *
 * `unchecked` is part of the answer rather than a footnote. A host pointing a
 * token at `var(--brand)` gets a truthful "this was not checked" instead of a
 * pass it did not earn.
 */
export function auditTheme(tokens: RulesTokens): ThemeAudit {
  const unreadable = new Set<RulesToken>();
  const findings: ContrastFinding[] = [];

  for (const token of RULES_TOKENS) {
    if (parseColor(tokens[token]) === undefined) unreadable.add(token);
  }

  for (const pair of CONTRAST_PAIRS) {
    const foreground = parseColor(tokens[pair.foreground]);
    const background = parseColor(tokens[pair.background]);
    if (foreground === undefined || background === undefined) continue;

    const ratio = contrastRatio(foreground, background);
    const required = pair.size === 'large' ? AA_LARGE : AA_NORMAL;
    findings.push({ pair, ratio, required, passes: ratio >= required });
  }

  const failures = findings.filter((finding) => !finding.passes);

  return {
    findings,
    failures,
    unchecked: [...unreadable],
    passes: failures.length === 0,
  };
}

/** The failures, as lines somebody can act on. Empty when a theme passes. */
export function auditReport(audit: ThemeAudit): string {
  return audit.failures
    .map(
      (finding) =>
        `${finding.pair.foreground} on ${finding.pair.background} (${finding.pair.where}) is ` +
        `${finding.ratio.toFixed(2)}:1, needs ${String(finding.required)}:1`,
    )
    .join('\n');
}
