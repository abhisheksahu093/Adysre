'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon, RotateCw, ExternalLink } from 'lucide-react';
import { Button, cn } from 'adysre';
import { usePreviewHeight } from '@/hooks/use-preview-height';
import { PREVIEW_DEVICES, deviceWidth, type PreviewDeviceId } from './preview-devices';

interface ComponentPreviewProps {
  slug: string;
  /** Height hint from the registry; the iframe reports its real height after load. */
  minHeight?: number;
}

export function ComponentPreview({ slug, minHeight = 192 }: ComponentPreviewProps) {
  const t = useTranslations('components');
  const { resolvedTheme } = useTheme();
  const [device, setDevice] = useState<PreviewDeviceId>('desktop');
  // next-themes can't know the theme during SSR: `resolvedTheme` is undefined
  // on the server, so the icon and the iframe's ?theme would differ between the
  // server HTML and the first client render - a hydration mismatch. Hold the
  // theme-dependent UI back until mount. This also avoids loading the iframe
  // once as light and again as dark.
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState<boolean | null>(null);
  const height = usePreviewHeight(slug, minHeight);
  // Bumping this remounts the iframe - the only reliable way to reset a
  // component's internal state (a spinner mid-flight, an open accordion).
  const [nonce, setNonce] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => setMounted(true), []);

  // Follow the page theme until the user overrides it for this preview.
  const isDark = dark ?? (mounted && resolvedTheme === 'dark');
  const src = `/preview/${slug}?theme=${isDark ? 'dark' : 'light'}&v=${nonce}`;

  const width = deviceWidth(device);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-2 py-2">
        <div role="group" aria-label={t('preview.device')} className="flex gap-1">
          {PREVIEW_DEVICES.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t(`preview.${id}`)}
              aria-pressed={device === id}
              title={t(`preview.${id}`)}
              onClick={() => setDevice(id)}
              className={cn(
                'h-8 w-8 text-muted-foreground hover:text-foreground',
                device === id && 'bg-muted text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isDark ? t('preview.toLight') : t('preview.toDark')}
            title={isDark ? t('preview.toLight') : t('preview.toDark')}
            onClick={() => setDark(!isDark)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('preview.reset')}
            title={t('preview.reset')}
            onClick={() => setNonce((n) => n + 1)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('preview.fullscreen')}
            title={t('preview.fullscreen')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="flex justify-center bg-muted/30 p-4">
        <div
          className="overflow-hidden rounded-md border border-border transition-[width] duration-200"
          style={{ width: width ? `${width}px` : '100%', maxWidth: '100%' }}
        >
          {mounted ? (
            <iframe
              key={nonce}
              ref={frameRef}
              src={src}
              title={t('preview.title')}
              loading="lazy"
              // Real component, real animation - the iframe is for viewport
              // isolation, not containment. Scripts must run.
              sandbox="allow-scripts allow-same-origin"
              className="w-full border-0 bg-background"
              style={{ height: `${height}px` }}
            />
          ) : (
            // Same box, so mounting the iframe doesn't shift the page.
            <div className="w-full bg-background" style={{ height: `${height}px` }} aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
