'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type JsBarcodeType from 'jsbarcode';
import { Barcode as BarcodeIcon, Download } from 'lucide-react';
import { Button, Input, Label, Select, cn } from 'adysre';
import {
  BARCODE_FORMATS,
  BARCODE_META,
  DEFAULT_BARCODE_DESIGN,
  type BarcodeDesign,
  type BarcodeFormat,
} from '@/lib/tools/barcode/types';
import { validateBarcode } from '@/lib/tools/barcode/validate';

/**
 * Barcode Generator.
 *
 * Renders a live, scannable barcode with the open-source JsBarcode (no external
 * API), validated and check-digit-normalised by the pure engine in
 * `@/lib/tools/barcode`. Downloads as SVG (vector) or PNG (rendered to an
 * offscreen canvas). "QR Hybrid" additionally renders a QR of the same value,
 * reusing the QR library — one label, both symbologies.
 *
 * JsBarcode and qr-code-styling touch the DOM, so both are dynamically imported
 * on the client only.
 */
export function BarcodeGenerator() {
  const [format, setFormat] = useState<BarcodeFormat>('CODE128');
  const [value, setValue] = useState(BARCODE_META.CODE128.sample);
  const [design, setDesign] = useState<BarcodeDesign>(DEFAULT_BARCODE_DESIGN);
  const [hybrid, setHybrid] = useState(false);

  const [lib, setLib] = useState<typeof JsBarcodeType | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const validation = useMemo(() => validateBarcode(format, value), [format, value]);

  const options = useMemo(
    () => ({
      format: BARCODE_META[format].jsFormat,
      lineColor: design.lineColor,
      background: design.transparent ? 'transparent' : design.background,
      width: design.width,
      height: design.height,
      margin: design.margin,
      displayValue: design.displayValue,
      fontSize: design.fontSize,
    }),
    [format, design],
  );

  // Load JsBarcode once, client-side.
  useEffect(() => {
    let cancelled = false;
    void import('jsbarcode').then((m) => {
      if (!cancelled) setLib(() => m.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Render the barcode on any change.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !lib) return;
    if (!validation.valid) {
      svg.replaceChildren();
      return;
    }
    try {
      lib(svg, validation.value, options);
    } catch {
      svg.replaceChildren();
    }
  }, [lib, validation, options]);

  // QR hybrid: render a QR of the same value beside the barcode.
  useEffect(() => {
    const container = qrRef.current;
    if (!container) return;
    if (!hybrid || !validation.valid) {
      container.replaceChildren();
      return;
    }
    let cancelled = false;
    void import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (cancelled || !container) return;
      const qr = new QRCodeStyling({
        width: 140,
        height: 140,
        type: 'svg',
        data: validation.value,
        margin: 0,
        dotsOptions: { color: design.lineColor, type: 'square' },
        backgroundOptions: { color: design.transparent ? 'transparent' : design.background },
      });
      container.replaceChildren();
      qr.append(container);
    });
    return () => {
      cancelled = true;
    };
  }, [hybrid, validation, design.lineColor, design.background, design.transparent]);

  function selectFormat(next: BarcodeFormat) {
    setFormat(next);
    setValue(BARCODE_META[next].sample);
  }

  const patch = (p: Partial<BarcodeDesign>) => setDesign((d) => ({ ...d, ...p }));

  function downloadSvg() {
    if (!svgRef.current || !validation.valid) return;
    const source = new XMLSerializer().serializeToString(svgRef.current);
    triggerDownload(`barcode-${format}.svg`, new Blob([source], { type: 'image/svg+xml' }));
  }

  function downloadPng() {
    if (!lib || !validation.valid) return;
    const canvas = document.createElement('canvas');
    try {
      lib(canvas, validation.value, options);
      canvas.toBlob((blob) => blob && triggerDownload(`barcode-${format}.png`, blob), 'image/png');
    } catch {
      /* invalid input never reaches here, but never throw at the user. */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* ── Controls ───────────────────────────────────────────────────────── */}
      <div className="space-y-8">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bc-format">Format</Label>
              <Select id="bc-format" value={format} onChange={(e) => selectFormat(e.target.value as BarcodeFormat)}>
                {BARCODE_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {BARCODE_META[f].label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bc-value">Value</Label>
              <Input id="bc-value" value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" />
            </div>
          </div>
          <p className={cn('text-xs', validation.valid ? 'text-muted-foreground' : 'text-destructive')}>
            {validation.valid ? BARCODE_META[format].hint : validation.message}
          </p>
        </section>

        <section className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Design</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField label="Bars" value={design.lineColor} onChange={(v) => patch({ lineColor: v })} />
            <ColorField
              label="Background"
              value={design.background}
              onChange={(v) => patch({ background: v })}
              disabled={design.transparent}
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Toggle label="Transparent background" on={design.transparent} onChange={(v) => patch({ transparent: v })} />
            <Toggle label="Show value text" on={design.displayValue} onChange={(v) => patch({ displayValue: v })} />
            <Toggle label="QR hybrid" on={hybrid} onChange={setHybrid} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <RangeField label={`Bar width (${design.width})`} min={1} max={4} step={1} value={design.width} onChange={(v) => patch({ width: v })} />
            <RangeField label={`Height (${design.height})`} min={40} max={200} step={10} value={design.height} onChange={(v) => patch({ height: v })} />
            <RangeField label={`Quiet zone (${design.margin})`} min={0} max={40} step={2} value={design.margin} onChange={(v) => patch({ margin: v })} />
          </div>
        </section>
      </div>

      {/* ── Preview + downloads ────────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div
            className={cn(
              'flex min-h-[10rem] flex-wrap items-center justify-center gap-6 overflow-auto rounded-xl border border-border p-4',
              design.transparent
                ? 'bg-[repeating-conic-gradient(theme(colors.muted.DEFAULT)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]'
                : 'bg-muted/30',
            )}
          >
            {validation.valid ? (
              <>
                <svg ref={svgRef} />
                {hybrid && <div ref={qrRef} />}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
                <BarcodeIcon className="h-6 w-6" aria-hidden />
                <p>{validation.message}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" size="sm" disabled={!validation.valid} onClick={downloadPng}>
              <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              PNG
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={!validation.valid} onClick={downloadSvg}>
              <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              SVG
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Rendered locally. Nothing leaves your browser.
          </p>
        </div>
      </aside>
    </div>
  );
}

function triggerDownload(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className={cn('flex items-center gap-2', disabled && 'opacity-50')}>
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background"
          aria-label={label}
        />
        <Input value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="font-mono" />
      </div>
    </div>
  );
}

function RangeField({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 w-full cursor-pointer accent-primary"
      />
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span className={cn('relative h-5 w-9 rounded-full border transition-colors', on ? 'border-primary bg-primary/20' : 'border-border bg-muted')}>
        <span className={cn('absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all', on ? 'left-[1.15rem] bg-primary' : 'left-0.5 bg-muted-foreground')} />
      </span>
      {label}
    </button>
  );
}
