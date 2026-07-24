'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import DOMPurify from 'dompurify';
import { toPng } from 'html-to-image';
import { Check, Code2, Copy, Download, ImagePlus, Loader2, Printer, Trash2 } from 'lucide-react';
import { Button, Input, Label, Select } from 'adysre';
import type { SignatureData, SocialPlatform } from '@/lib/tools/signature/types';
import { SOCIAL_PLATFORMS } from '@/lib/tools/signature/types';
import { SAMPLE_SIGNATURE } from '@/lib/tools/signature/sample';
import { SIGNATURE_THEMES, SIGNATURE_THEMES_BY_ID, SOCIAL_META } from '@/lib/tools/signature/themes';
import { buildSignatureHtml } from '@/lib/tools/signature/build';

/**
 * Email Signature Generator. A live editor beside a live preview of the exact
 * table-based HTML `build.ts` emits, with copy (HTML + rich text for pasting
 * into Gmail/Outlook), download (HTML + PNG) and print. All client-side, no API:
 * DOMPurify sanitizes before copy, html-to-image renders the PNG.
 */

const FONTS: Array<{ label: string; value: string }> = [
  { label: 'Helvetica / Arial', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: 'Georgia (serif)', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet', value: "'Trebuchet MS', Tahoma, sans-serif" },
];

const HTML_DOC = (inner: string) =>
  `<!doctype html><html><head><meta charset="utf-8"></head><body>${inner}</body></html>`;

function sanitize(html: string): string {
  return typeof window === 'undefined' ? html : DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function download(name: string, content: BlobPart, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

type CopyState = 'idle' | 'html' | 'rich';

export function SignatureGenerator() {
  const [sig, setSig] = useState<SignatureData>(SAMPLE_SIGNATURE);
  const [copied, setCopied] = useState<CopyState>('idle');
  const [pngBusy, setPngBusy] = useState(false);

  const html = useMemo(() => buildSignatureHtml(sig), [sig]);
  const safeHtml = useMemo(() => sanitize(html), [html]);

  const set = (patch: Partial<SignatureData>) => setSig((s) => ({ ...s, ...patch }));
  const setDesign = (patch: Partial<SignatureData['design']>) => setSig((s) => ({ ...s, design: { ...s.design, ...patch } }));

  function selectTheme(id: string) {
    const theme = SIGNATURE_THEMES_BY_ID[id];
    if (theme) setSig((s) => ({ ...s, themeId: id, design: { ...theme.design } }));
  }

  function setSocial(platform: SocialPlatform, url: string) {
    setSig((s) => {
      const rest = s.socials.filter((x) => x.platform !== platform);
      return { ...s, socials: url.trim() ? [...rest, { platform, url }] : rest };
    });
  }
  const socialUrl = (p: SocialPlatform) => sig.socials.find((x) => x.platform === p)?.url ?? '';

  function onImage(key: 'logo' | 'photo' | 'banner') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => set({ [key]: typeof reader.result === 'string' ? reader.result : '' });
      reader.readAsDataURL(file);
    };
  }

  async function copyHtml() {
    await navigator.clipboard.writeText(safeHtml);
    flash('html');
  }

  async function copyRich() {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([safeHtml], { type: 'text/html' }),
          'text/plain': new Blob([safeHtml], { type: 'text/plain' }),
        }),
      ]);
    } catch {
      await navigator.clipboard.writeText(safeHtml);
    }
    flash('rich');
  }

  function flash(kind: CopyState) {
    setCopied(kind);
    window.setTimeout(() => setCopied('idle'), 1500);
  }

  async function downloadPng() {
    const node = document.getElementById('signature-preview');
    if (!node) return;
    setPngBusy(true);
    try {
      const url = await toPng(node, { pixelRatio: 2, backgroundColor: sig.design.background });
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signature.png';
      a.click();
    } finally {
      setPngBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[24rem_1fr] lg:gap-8">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Editor */}
      <div className="relative space-y-6 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        <Panel title="Details">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={sig.name} onChange={(v) => set({ name: v })} className="col-span-2" />
            <Field label="Designation" value={sig.designation} onChange={(v) => set({ designation: v })} />
            <Field label="Company" value={sig.company} onChange={(v) => set({ company: v })} />
          </div>
        </Panel>

        <Panel title="Contact">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" value={sig.phone} onChange={(v) => set({ phone: v })} />
            <Field label="Mobile" value={sig.mobile} onChange={(v) => set({ mobile: v })} />
            <Field label="Email" value={sig.email} onChange={(v) => set({ email: v })} />
            <Field label="Website" value={sig.website} onChange={(v) => set({ website: v })} />
            <Field label="Address" value={sig.address} onChange={(v) => set({ address: v })} className="col-span-2" />
          </div>
        </Panel>

        <Panel title="Media">
          <div className="flex flex-wrap gap-2">
            <ImageButton label="logo" has={!!sig.logo} onChange={onImage('logo')} onClear={() => set({ logo: '' })} />
            <ImageButton label="photo" has={!!sig.photo} onChange={onImage('photo')} onClear={() => set({ photo: '' })} />
            <ImageButton label="banner" has={!!sig.banner} onChange={onImage('banner')} onClear={() => set({ banner: '' })} />
          </div>
        </Panel>

        <Panel title="Call to action">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Button label" value={sig.cta.label} onChange={(v) => set({ cta: { ...sig.cta, label: v } })} />
            <Field label="Button URL" value={sig.cta.url} onChange={(v) => set({ cta: { ...sig.cta, url: v } })} />
          </div>
        </Panel>

        <Panel title="Social links">
          <div className="grid grid-cols-1 gap-2">
            {SOCIAL_PLATFORMS.map((p) => (
              <div key={p} className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                  style={{ background: SOCIAL_META[p].color }}
                >
                  {SOCIAL_META[p].short}
                </span>
                <Input placeholder={SOCIAL_META[p].label} value={socialUrl(p)} onChange={(e) => setSocial(p, e.target.value)} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Theme & design">
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect label="Theme" value={sig.themeId} onChange={selectTheme}>
              {SIGNATURE_THEMES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </FieldSelect>
            <FieldSelect label="Font" value={sig.design.font} onChange={(v) => setDesign({ font: v })}>
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </FieldSelect>
            <ColorField label="Name color" value={sig.design.primaryColor} onChange={(v) => setDesign({ primaryColor: v })} />
            <ColorField label="Accent" value={sig.design.accentColor} onChange={(v) => setDesign({ accentColor: v })} />
            <ColorField label="Text" value={sig.design.textColor} onChange={(v) => setDesign({ textColor: v })} />
            <ColorField label="Background" value={sig.design.background} onChange={(v) => setDesign({ background: v })} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <RangeField label={`Icon size (${sig.design.iconSize})`} min={18} max={40} value={sig.design.iconSize} onChange={(v) => setDesign({ iconSize: v })} />
            <RangeField label={`Spacing (${sig.design.spacing})`} min={2} max={20} value={sig.design.spacing} onChange={(v) => setDesign({ spacing: v })} />
            <RangeField label={`Photo size (${sig.design.photoSize})`} min={48} max={120} value={sig.design.photoSize} onChange={(v) => setDesign({ photoSize: v })} />
            <RangeField label={`Logo width (${sig.design.logoWidth})`} min={80} max={200} value={sig.design.logoWidth} onChange={(v) => setDesign({ logoWidth: v })} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <Toggle label="Rounded images" on={sig.design.roundedImages} onChange={(v) => setDesign({ roundedImages: v })} />
            <Toggle label="Border" on={sig.design.showBorder} onChange={(v) => setDesign({ showBorder: v })} />
            <Toggle label="Dividers" on={sig.design.showDividers} onChange={(v) => setDesign({ showDividers: v })} />
          </div>
        </Panel>
      </div>

      {/* Preview + actions */}
      <div className="relative space-y-4 lg:min-h-0 lg:overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => void copyRich()}>
            {copied === 'rich' ? <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden /> : <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden />}
            Copy rich text
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => void copyHtml()}>
            {copied === 'html' ? <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden /> : <Code2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />}
            Copy HTML
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => download('signature.html', HTML_DOC(safeHtml), 'text/html')}>
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            HTML
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={pngBusy} onClick={() => void downloadPng()}>
            {pngBusy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden /> : <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />}
            PNG
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Print
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 dark:bg-white">
          <div id="signature-preview" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </div>
        <p className="text-xs text-muted-foreground">
          Table based, inline styled HTML. Works in Gmail, Outlook, Apple Mail and Thunderbird. Nothing leaves your browser.
        </p>
      </div>
    </div>
  );
}

const PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #signature-preview, #signature-preview * { visibility: visible !important; }
  #signature-preview { position: absolute; left: 0; top: 0; }
}`;

// ── Small form primitives ────────────────────────────────────────────────────

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, className }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className ? `${className} space-y-1.5` : 'space-y-1.5'}>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FieldSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>{children}</Select>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background" aria-label={label} />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono" />
      </div>
    </div>
  );
}

function RangeField({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-9 w-full cursor-pointer accent-primary" />
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <span className={`relative h-5 w-9 rounded-full border transition-colors ${on ? 'border-primary bg-primary/20' : 'border-border bg-muted'}`}>
        <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${on ? 'left-[1.15rem] bg-primary' : 'left-0.5 bg-muted-foreground'}`} />
      </span>
      {label}
    </button>
  );
}

function ImageButton({ label, has, onChange, onClear }: { label: string; has: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void; onClear: () => void }) {
  return (
    <div className="inline-flex items-center gap-1">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <ImagePlus className="h-4 w-4" aria-hidden />
        {has ? `Replace ${label}` : label}
        <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
      </label>
      {has && (
        <Button type="button" variant="outline" size="sm" aria-label={`Remove ${label}`} onClick={onClear}>
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </Button>
      )}
    </div>
  );
}
