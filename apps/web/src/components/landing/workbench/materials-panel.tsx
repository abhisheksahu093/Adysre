'use client';

import { useState, type CSSProperties } from 'react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import type { IconSample, PaletteSample, SurfaceSample } from '@/data/workbench';
import { IconGlyph } from '@/components/icons/icon-glyph';
import { Hud, Panel } from './panel';

/** An icon on the shelf: the sample, plus its already-translated caption. */
export interface IconTile extends IconSample {
  /** Translated category label, e.g. "Interface". */
  caption: string;
}

/** One shelf in the panel: a family of material, and where the rest of it lives. */
export interface MaterialGroup {
  id: string;
  /** Already-translated family name, used as the tab label. */
  label: string;
  /** The library page this family lives on. */
  href: string;
  /** Already-translated call to action for that page, e.g. "Browse gradients". */
  browseLabel: string;
  palettes?: PaletteSample[];
  surfaces?: SurfaceSample[];
  icons?: IconTile[];
}

/**
 * The materials panel: the catalogue itself, on a shelf.
 *
 * The tabs are real - they switch which family is on the shelf - and every
 * sample is a published record rendered by its own CSS, not a picture of one.
 * This is the one place on the page where colour is allowed to shout, which is
 * why everything around it is graphite.
 *
 * Client Component for the tab state. Samples arrive as props from the server
 * (`@/data/workbench`), so the catalogues never reach the browser.
 */
export function MaterialsPanel({ title, groups }: { title: string; groups: MaterialGroup[] }) {
  const [activeId, setActiveId] = useState(groups[0]?.id ?? '');
  const active = groups.find((group) => group.id === activeId) ?? groups[0];

  if (!active) return null;

  return (
    <Panel
      title={title}
      actions={
        <span className="flex flex-wrap items-center gap-1">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveId(group.id)}
              aria-pressed={group.id === active.id}
              className={cn(
                'rounded-md px-2.5 py-1 font-hud text-[10.5px] uppercase tracking-[0.08em] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                // Active state is tool chrome, so it wears the signal colour
                // rather than plain ink: same accent as the selection in the
                // artboard and the actions on the page.
                group.id === active.id
                  ? 'bg-signal text-signal-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {group.label}
            </button>
          ))}
        </span>
      }
    >
      {/* Icons are read in a glance and a swatch is not, so the icon shelf packs
          its column count up and its tiles down. Everything else keeps the wide
          six-across rhythm a palette or a gradient needs to be judged. */}
      <ul
        className={cn(
          'grid gap-3',
          active.icons
            ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-10'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
        )}
      >
        {active.palettes?.map((palette) => (
          <li key={palette.id}>
            <Link href={active.href} className="group block focus-visible:outline-none">
              <span className="flex h-16 overflow-hidden rounded-lg border border-line transition-transform group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                {palette.colors.map((color) => (
                  <span key={color} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="mt-2 block truncate text-xs font-medium">{palette.name}</span>
              {/* The first stop, in the form you would paste it. A bare count of
                  stops told nobody anything the swatch above had not shown. */}
              <Hud className="block truncate">{palette.colors[0]}</Hud>
            </Link>
          </li>
        ))}

        {/* Icons are drawn from their authored body at the library's own size, so
            the shelf shows the real geometry rather than a picture of it. The
            wave runs across the shelf the way it runs across the artboard, and
            the glyph under the cursor steps out of it. */}
        {active.icons?.map((icon, index) => (
          <li key={icon.id}>
            <Link href={active.href} className="group block focus-visible:outline-none">
              <span className="flex h-12 items-center justify-center rounded-lg border border-line bg-panel-raised text-foreground transition-colors group-hover:border-signal/40 group-hover:text-signal group-focus-visible:ring-2 group-focus-visible:ring-ring">
                <span
                  className="glyph-wave"
                  // An index, not a design value: the timing lives in the CSS.
                  style={{ '--glyph-index': index } as CSSProperties}
                >
                  <IconGlyph
                    body={icon.body}
                    size={22}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </span>
              </span>
              <span className="mt-1.5 block truncate text-[11px] font-medium leading-tight">
                {icon.title}
              </span>
              <Hud className="block truncate">{icon.caption}</Hud>
            </Link>
          </li>
        ))}

        {active.surfaces?.map((surface) => (
          <li key={surface.id}>
            <Link href={active.href} className="group block focus-visible:outline-none">
              <span
                className="block h-16 overflow-hidden rounded-lg border border-line transition-transform group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-ring"
                style={surface.style}
              />
              <span className="mt-2 block truncate text-xs font-medium">{surface.name}</span>
              <Hud className="block truncate">{surface.kind}</Hud>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={active.href}
        className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {active.browseLabel}
        <span aria-hidden>→</span>
      </Link>
    </Panel>
  );
}
