import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { cn } from 'adysre';
import type { ResumeData, SectionType, SkillItem } from '@/lib/tools/resume/types';
import { RESUME_TEMPLATES_BY_ID, type ResumeTemplate } from '@/lib/tools/resume/templates';
import { orderedVisibleSections } from '@/lib/tools/resume/serialize';

/**
 * The rendered resume — the paper artifact. Colors come from the template
 * (inline, so print keeps them), and the `sections` order/visibility drives what
 * renders and where. Three layouts: classic (one column), modern (accent header
 * band) and sidebar (accent rail with contact/skills). This paper sits inside
 * the `#resume-print` wrapper, which is what the print stylesheet isolates.
 */
export function ResumePreview({ data }: { data: ResumeData }) {
  const t = RESUME_TEMPLATES_BY_ID[data.templateId] ?? RESUME_TEMPLATES_BY_ID.minimal!;
  const font = data.design.font || undefined;
  const accent = data.design.accent || t.accent;
  const tpl: ResumeTemplate = { ...t, accent };
  const visible = orderedVisibleSections(data);
  const types = new Set(visible.map((s) => s.type));

  const body =
    t.layout === 'sidebar'
      ? <Sidebar data={data} t={tpl} types={types} order={visible.map((s) => s.type)} />
      : <Stacked data={data} t={tpl} order={visible.map((s) => s.type)} banner={t.layout === 'modern'} />;

  return (
    <div id="resume-paper" className={cn('mx-auto w-full text-[13px] leading-relaxed', t.fontClass)} style={{ background: t.surface, color: t.text, fontFamily: font }}>
      {body}
    </div>
  );
}

// ── Layout: classic / modern (single column) ─────────────────────────────────

function Stacked({ data, t, order, banner }: { data: ResumeData; t: ResumeTemplate; order: SectionType[]; banner: boolean }) {
  return (
    <div>
      {banner ? (
        <div className="px-8 py-6" style={{ background: t.accent, color: t.accentText }}>
          <Name data={data} inverse />
        </div>
      ) : (
        <div className="px-8 pt-8">
          <Name data={data} t={t} />
          <div className="mt-3 border-t" style={{ borderColor: t.border }} />
        </div>
      )}
      <div className="space-y-5 px-8 py-6">
        {order.map((type) => (
          <Section key={type} type={type} data={data} t={t} />
        ))}
      </div>
    </div>
  );
}

// ── Layout: sidebar ──────────────────────────────────────────────────────────

function Sidebar({ data, t, types, order }: { data: ResumeData; t: ResumeTemplate; types: Set<SectionType>; order: SectionType[] }) {
  const mainOrder = order.filter((x) => x !== 'skills' && x !== 'links');
  const railBg = t.sidebar ?? t.accent;
  const railText = t.sidebarText ?? t.accentText;
  const railMuted = t.sidebarMuted ?? railText;
  const railTitle = { color: railText } as const;
  const contact = data.contact;

  return (
    <div className="grid grid-cols-[12rem_1fr]">
      <aside className="space-y-5 p-6" style={{ background: railBg, color: railText }}>
        {data.photo && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.photo}
              alt=""
              className="h-24 w-24 rounded-full object-cover ring-2"
              style={{ borderColor: t.accent }}
            />
          </div>
        )}
        <div className={data.photo ? 'text-center' : ''}>
          <p className="text-lg font-bold leading-tight">{contact.name || 'Your Name'}</p>
          <p className="text-xs" style={{ color: t.accent }}>{contact.headline}</p>
        </div>

        <div className="space-y-1.5 text-[11px]" style={{ color: railMuted }}>
          <ContactLine icon={<Mail className="h-3 w-3" aria-hidden />} value={contact.email} show={t.contactIcons} />
          <ContactLine icon={<Phone className="h-3 w-3" aria-hidden />} value={contact.phone} show={t.contactIcons} />
          <ContactLine icon={<MapPin className="h-3 w-3" aria-hidden />} value={contact.location} show={t.contactIcons} />
          <ContactLine icon={<Globe className="h-3 w-3" aria-hidden />} value={contact.website} show={t.contactIcons} />
        </div>

        {types.has('skills') && data.skills.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={railTitle}>
              {data.sections.find((s) => s.type === 'skills')?.title ?? 'Skills'}
            </p>
            <SidebarSkills skills={data.skills} t={t} railMuted={railMuted} />
          </div>
        )}

        {types.has('links') && data.links.length > 0 && (
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest" style={railTitle}>
              {data.sections.find((s) => s.type === 'links')?.title ?? 'Links'}
            </p>
            <ul className="space-y-0.5 text-[11px]" style={{ color: railMuted }}>
              {data.links.map((l) => (
                <li key={l.id}>{l.label}: {l.url}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      <div className="space-y-5 p-6">
        {mainOrder.map((type) => (
          <Section key={type} type={type} data={data} t={t} />
        ))}
      </div>
    </div>
  );
}

function ContactLine({ icon, value, show }: { icon: React.ReactNode; value: string; show?: boolean | undefined }) {
  if (!value) return null;
  return (
    <p className="flex items-center gap-1.5">
      {show && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{value}</span>
    </p>
  );
}

/** Skills in the rail: bars, dots or a plain list, honoring optional levels. */
function SidebarSkills({ skills, t, railMuted }: { skills: SkillItem[]; t: ResumeTemplate; railMuted: string }) {
  const style = t.skillStyle ?? 'pill';

  if (style === 'bar') {
    return (
      <ul className="space-y-1.5">
        {skills.map((s) => (
          <li key={s.name} className="text-[11px]">
            <span>{s.name}</span>
            {s.level ? (
              <span className="mt-0.5 block h-1 w-full overflow-hidden rounded-full" style={{ background: `${railMuted}40` }}>
                <span className="block h-full rounded-full" style={{ width: `${(s.level / 5) * 100}%`, background: t.accent }} />
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  if (style === 'dots') {
    return (
      <ul className="space-y-1">
        {skills.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-2 text-[11px]">
            <span>{s.name}</span>
            {s.level ? (
              <span className="flex shrink-0 gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className="h-1.5 w-1.5 rounded-full" style={{ background: n <= s.level! ? t.accent : `${railMuted}40` }} />
                ))}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-0.5 text-[11px]" style={{ color: railMuted }}>
      {skills.map((s) => (
        <li key={s.name}>{s.name}</li>
      ))}
    </ul>
  );
}

// ── Pieces ───────────────────────────────────────────────────────────────────

function Name({ data, t, inverse }: { data: ResumeData; t?: ResumeTemplate; inverse?: boolean }) {
  return (
    <div>
      <p className="text-2xl font-bold leading-tight">{data.contact.name || 'Your Name'}</p>
      <p className={cn('text-sm', inverse ? 'opacity-90' : '')} style={!inverse && t ? { color: t.accent } : undefined}>
        {data.contact.headline}
      </p>
      <p className={cn('mt-1 text-xs', inverse ? 'opacity-90' : '')} style={!inverse && t ? { color: t.muted } : undefined}>
        {[data.contact.email, data.contact.phone, data.contact.location, data.contact.website].filter(Boolean).join('  ·  ')}
      </p>
    </div>
  );
}

function Heading({ children, t }: { children: string; t: ResumeTemplate }) {
  return (
    <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: t.accent }}>
      {children}
      <span className="mt-1 block h-px w-full" style={{ background: t.border }} />
    </h2>
  );
}

function Section({ type, data, t }: { type: SectionType; data: ResumeData; t: ResumeTemplate }) {
  const title = data.sections.find((s) => s.type === type)?.title ?? type;
  if (type === 'summary') return data.summary ? <div><Heading t={t}>{title}</Heading><p style={{ color: t.text }}>{data.summary}</p></div> : null;

  if (type === 'skills') {
    return data.skills.length ? (
      <div>
        <Heading t={t}>{title}</Heading>
        <ul className="flex flex-wrap gap-1.5">
          {data.skills.map((s) => <li key={s.name} className="rounded px-2 py-0.5 text-xs" style={{ background: `${t.accent}14`, color: t.text }}>{s.name}</li>)}
        </ul>
      </div>
    ) : null;
  }

  if (type === 'experience') {
    return data.experience.length ? (
      <div>
        <Heading t={t}>{title}</Heading>
        <div className="space-y-3">
          {data.experience.map((e) => (
            <div key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <p className="font-semibold">{e.role}{e.company ? ` · ${e.company}` : ''}</p>
                <p className="text-xs" style={{ color: t.muted }}>{e.period}{e.location ? ` · ${e.location}` : ''}</p>
              </div>
              {e.bullets && (
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs">
                  {e.bullets.split('\n').filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }

  if (type === 'education') {
    return data.education.length ? (
      <div>
        <Heading t={t}>{title}</Heading>
        <div className="space-y-2">
          {data.education.map((e) => (
            <div key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-2">
              <p className="font-semibold">{e.degree}{e.school ? ` · ${e.school}` : ''}</p>
              <p className="text-xs" style={{ color: t.muted }}>{e.period}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }

  if (type === 'projects') {
    return data.projects.length ? (
      <div>
        <Heading t={t}>{title}</Heading>
        <div className="space-y-2">
          {data.projects.map((p) => (
            <div key={p.id}>
              <p className="font-semibold">{p.name} {p.url && <span className="text-xs font-normal" style={{ color: t.muted }}>· {p.url}</span>}</p>
              {p.description && <p className="text-xs" style={{ color: t.text }}>{p.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }

  if (type === 'certifications') {
    return data.certifications.length ? (
      <div>
        <Heading t={t}>{title}</Heading>
        <ul className="space-y-1 text-xs">
          {data.certifications.map((c) => <li key={c.id}><span className="font-medium">{c.name}</span>{c.issuer ? ` · ${c.issuer}` : ''}{c.year ? ` · ${c.year}` : ''}</li>)}
        </ul>
      </div>
    ) : null;
  }

  if (type === 'links') {
    return data.links.length ? (
      <div>
        <Heading t={t}>{title}</Heading>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {data.links.map((l) => <li key={l.id}><span style={{ color: t.muted }}>{l.label}:</span> {l.url}</li>)}
        </ul>
      </div>
    ) : null;
  }

  return null;
}
