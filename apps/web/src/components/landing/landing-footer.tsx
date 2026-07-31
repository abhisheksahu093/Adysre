import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { LANDING_LINKS } from '@/data/landing';
import { Hud } from './workbench/panel';

/** The year is stamped at render; no client clock needed. */
const YEAR = new Date().getFullYear();

/**
 * Marketing footer, drawn as the last panel on the canvas.
 *
 * Server Component. Link labels reuse the shared `nav`, `userMenu` and
 * `pricing` catalogues wherever an entry already exists, so the footer can never
 * disagree with the sidebar or the account menu.
 */
export async function LandingFooter() {
  const [t, tNav, tUser, tPricing] = await Promise.all([
    getTranslations('landing'),
    getTranslations('nav'),
    getTranslations('userMenu'),
    getTranslations('pricing'),
  ]);

  const columns = [
    {
      // The library families, split from the tools so neither column runs long.
      heading: t('footer.library'),
      links: [
        { href: LANDING_LINKS.components, label: tNav('components') },
        { href: LANDING_LINKS.icons, label: tNav('icons') },
        { href: LANDING_LINKS.colorsSurfaces, label: tNav('colorsSurfaces') },
        { href: LANDING_LINKS.templates, label: tNav('templates') },
      ],
    },
    {
      heading: t('footer.tools'),
      links: [
        { href: LANDING_LINKS.apiStudio, label: tNav('apiStudio') },
        { href: LANDING_LINKS.aiTools, label: tNav('aiTools') },
        { href: LANDING_LINKS.codes, label: tNav('codes') },
        { href: LANDING_LINKS.documents, label: tNav('documents') },
        { href: LANDING_LINKS.websiteIntelligence, label: tNav('websiteIntelligence') },
        { href: LANDING_LINKS.resume, label: tNav('resume') },
      ],
    },
    {
      heading: t('footer.resources'),
      links: [
        { href: LANDING_LINKS.pricing, label: tPricing('metaTitle') },
        { href: LANDING_LINKS.docs, label: t('footer.docs') },
        { href: LANDING_LINKS.contact, label: t('footer.contact') },
      ],
    },
    {
      heading: t('footer.legal'),
      links: [
        { href: LANDING_LINKS.terms, label: tUser('terms') },
        { href: LANDING_LINKS.privacy, label: tUser('privacy') },
        { href: LANDING_LINKS.dmca, label: tUser('dmca') },
      ],
    },
  ];

  return (
    <footer className="section-deferred mx-auto max-w-[1440px] px-4 pb-10 sm:px-6">
      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="grid grid-cols-2 gap-8 p-6 sm:p-8 md:grid-cols-6">
          <div className="col-span-2">
            <Logo height={24} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <Hud>{col.heading}</Hud>
              <ul className="mt-3.5 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-line bg-panel-raised px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Hud>
            © {YEAR} ADYSRE. {t('footer.rights')}
          </Hud>
          <Hud>{t('footer.built')}</Hud>
        </div>
      </div>
    </footer>
  );
}
