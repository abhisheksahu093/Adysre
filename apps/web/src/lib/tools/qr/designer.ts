import type { Options as QrStylingOptions } from 'qr-code-styling';

/**
 * Designer model - the customizable look of a QR, kept separate from its payload
 * (`registry.ts`) so a design can be reused across different QR contents. These
 * values map straight onto `qr-code-styling`'s options in `toStylingOptions`,
 * which is the one place that knows the library's shape.
 */

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type CornerStyle = 'square' | 'rounded' | 'extra-rounded' | 'dot';
export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface QrDesign {
  size: number;
  margin: number;
  foreground: string;
  background: string;
  transparentBackground: boolean;
  useGradient: boolean;
  gradientColor: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  errorCorrection: ErrorCorrection;
  /** Data URL of an uploaded logo, or null. */
  logo: string | null;
  logoSize: number;
}

export const DEFAULT_DESIGN: QrDesign = {
  size: 320,
  margin: 12,
  foreground: '#0a0a0a',
  background: '#ffffff',
  transparentBackground: false,
  useGradient: false,
  gradientColor: '#6d28d9',
  dotStyle: 'rounded',
  cornerStyle: 'extra-rounded',
  errorCorrection: 'Q',
  logo: null,
  logoSize: 0.4,
};

export const DOT_STYLES: ReadonlyArray<{ value: DotStyle; label: string }> = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy rounded' },
  { value: 'extra-rounded', label: 'Extra rounded' },
];

export const CORNER_STYLES: ReadonlyArray<{ value: CornerStyle; label: string }> = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra rounded' },
  { value: 'dot', label: 'Dot' },
];

export const ERROR_LEVELS: ReadonlyArray<{ value: ErrorCorrection; label: string }> = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' },
];

/**
 * Project the designer model onto qr-code-styling's option object. Kept pure and
 * exported so it can be tested and reused (e.g. a server-side PNG render later).
 */
export function toStylingOptions(data: string, design: QrDesign): QrStylingOptions {
  const cornerType =
    design.cornerStyle === 'dot' ? 'dot' : design.cornerStyle === 'square' ? 'square' : 'extra-rounded';

  return {
    width: design.size,
    height: design.size,
    type: 'svg',
    data: data || ' ',
    margin: design.margin,
    qrOptions: { errorCorrectionLevel: design.errorCorrection },
    // `image` is only set when a logo exists; qr-code-styling's type rejects an
    // explicit `undefined` under exactOptionalPropertyTypes.
    ...(design.logo
      ? {
          image: design.logo,
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 6,
            imageSize: design.logoSize,
            hideBackgroundDots: true,
          },
        }
      : {}),
    dotsOptions: design.useGradient
      ? {
          type: design.dotStyle,
          gradient: {
            type: 'linear',
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: design.foreground },
              { offset: 1, color: design.gradientColor },
            ],
          },
        }
      : { type: design.dotStyle, color: design.foreground },
    cornersSquareOptions: { type: cornerType, color: design.foreground },
    cornersDotOptions: { color: design.foreground },
    backgroundOptions: {
      color: design.transparentBackground ? 'transparent' : design.background,
    },
  };
}
