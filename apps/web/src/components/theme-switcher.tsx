'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { Button } from 'adysre';

/**
 * Single light/dark toggle (UI_DESIGN_SYSTEM.md requires a theme switcher).
 *
 * Toggles against `resolvedTheme`, not `theme`: with the default still
 * "system", `theme` reads "system" rather than the colour actually on screen,
 * so the first click would be a coin flip.
 */
export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('theme');

  // next-themes can't know the active theme during SSR, so render a stable
  // placeholder until mount to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <Button type="button" variant="ghost" size="icon" aria-label={t('toggle')} disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      // Name the destination, not the current state - that's what the click does.
      aria-label={isDark ? t('switchToLight') : t('switchToDark')}
      title={isDark ? t('switchToLight') : t('switchToDark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
