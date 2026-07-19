import { getTranslations } from 'next-intl/server';
import {
  Home,
  Bell,
  Heart,
  Star,
  Search,
  Settings,
  User,
  Camera,
  Cloud,
  Zap,
  Globe,
  Bookmark,
} from 'lucide-react';
import { Badge, Button, cn } from '@adysre/ui';
import { SectionHeading } from './section-heading';

/** Icons shown in the icon-preview tile. Purely illustrative. */
const PREVIEW_ICONS = [Home, Bell, Heart, Star, Search, Settings, User, Camera, Cloud, Zap, Globe, Bookmark];

/** A single labelled tile in the bento. */
function Tile({
  label,
  caption,
  className,
  children,
}: {
  label: string;
  caption: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-xl border border-border bg-card', className)}>
      <div className="flex-1 p-5">{children}</div>
      <div className="border-t border-border px-5 py-3">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}

/**
 * "See it work" bento: four live previews rendered from the same design tokens
 * the product uses, so what a visitor sees is genuinely on-brand. Server
 * Component; the previews are static and decorative (`aria-hidden` on the
 * visuals) with the meaning carried by each tile's label.
 */
export async function Showcase() {
  const t = await getTranslations('landing');

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading title={t('showcase.title')} subtitle={t('showcase.subtitle')} />

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Gradient tile - spans two columns on desktop. */}
        <Tile
          label={t('showcase.gradient.label')}
          caption={t('showcase.gradient.caption')}
          className="md:col-span-2"
        >
          <div
            className="h-40 w-full rounded-lg bg-gradient-to-br from-primary via-secondary to-accent"
            aria-hidden
          />
        </Tile>

        {/* Palette tile */}
        <Tile label={t('showcase.palette.label')} caption={t('showcase.palette.caption')}>
          <div className="grid h-40 grid-cols-2 gap-2" aria-hidden>
            <span className="rounded-lg bg-primary" />
            <span className="rounded-lg bg-secondary" />
            <span className="rounded-lg bg-accent" />
            <span className="rounded-lg bg-success" />
          </div>
        </Tile>

        {/* Icons tile */}
        <Tile label={t('showcase.icons.label')} caption={t('showcase.icons.caption')}>
          <div className="grid h-40 grid-cols-4 place-items-center gap-2" aria-hidden>
            {PREVIEW_ICONS.map((Icon, i) => (
              <span
                key={i}
                className="flex h-full w-full items-center justify-center rounded-md bg-muted/60 text-muted-foreground"
              >
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </Tile>

        {/* Components tile - spans two columns; renders real UI primitives. */}
        <Tile
          label={t('showcase.components.label')}
          caption={t('showcase.components.caption')}
          className="md:col-span-2"
        >
          <div
            className="flex h-40 flex-col justify-center gap-3 pointer-events-none"
            aria-hidden
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm leading-9 text-muted-foreground">
              Input field
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}
