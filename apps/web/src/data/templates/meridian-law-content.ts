import {
  Banknote,
  BookMarked,
  Briefcase,
  Building2,
  Gavel,
  Handshake,
  Landmark,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * MERIDIAN - content for the corporate law firm template.
 *
 * English, untranslated, and part of the artifact: a visitor downloads this
 * file and rewrites it into their own practice (see `types.ts`). Sections read
 * from here and hold no copy of their own, so the firm's voice lives in exactly
 * one file.
 *
 * MERIDIAN is a MULTIPAGE template - four pages rather than one long scroll,
 * because a law firm's audience arrives looking for a specific practice or a
 * specific office, not for a narrative. `TemplateContent` covers the shared
 * chrome and the home page; the extra exports below carry the copy the
 * dedicated pages need, each with its own local interface so the shared
 * template contract stays untouched.
 */

/** The pages MERIDIAN ships. `home` is what renders when no page is asked for. */
export const MERIDIAN_PAGES = ['home', 'about', 'practices', 'contact'] as const;
export type MeridianPageId = (typeof MERIDIAN_PAGES)[number];

/** The formal masthead every dedicated page opens with, in place of the hero. */
export interface MeridianPageHead {
  eyebrow: string;
  title: string;
  intro: string;
}

/** One practice area, told at the depth a general counsel actually needs. */
export interface MeridianPractice {
  name: string;
  summary: string;
  /** Representative matters - what the group has actually run. */
  matters: string[];
  lead: string;
}

/** A named lawyer. `initials` drives the CSS monogram, since there are no images. */
export interface MeridianPerson {
  initials: string;
  name: string;
  role: string;
  focus: string;
  admissions: string[];
}

/** One dated entry in the firm's history rail. */
export interface MeridianMilestone {
  year: string;
  title: string;
  body: string;
}

/** An office, addressed the way correspondence would be. */
export interface MeridianOffice {
  city: string;
  lines: string[];
  phone: string;
  hours: string;
}

export const MERIDIAN_CONTENT: TemplateContent = {
  brand: 'Meridian',

  // Query hrefs, not anchors: the header drives the page switch inside the
  // template itself, so the preview route needs no router to navigate.
  nav: [
    { href: '?page=about', label: 'The Firm' },
    { href: '?page=practices', label: 'Practices' },
    { href: '?page=contact', label: 'Contact' },
  ],

  hero: {
    badge: 'Boston · New York · Washington, D.C.',
    title: 'Counsel for the decisions',
    titleAccent: 'a board cannot delegate',
    subtitle:
      'Meridian Vance LLP advises boards, founders and institutional investors on the transactions, disputes and regulatory matters that determine what a company becomes. Established in Boston in 1988.',
    ctaPrimary: 'Request a consultation',
    ctaSecondary: 'Review our practices',
    stats: [
      { value: 38, suffix: '', label: 'Years in practice' },
      { value: 64, suffix: '', label: 'Attorneys across three offices' },
      { value: 12, suffix: 'B', label: 'Transaction value closed in 2025 (USD)' },
    ],
  },

  marquee: [
    'Chambers USA — Band 1, Corporate/M&A',
    'The Legal 500 — Leading Firm',
    'Benchmark Litigation — Highly Recommended',
    'IFLR1000 — Notable Practitioners',
    'Best Lawyers — Firm of the Year, Securities',
    'Massachusetts Bar Association',
  ],

  about: {
    eyebrow: 'The firm',
    title: 'Built for matters that outlast a single quarter',
    body: [
      'Meridian was founded in 1988 by four partners who left a national firm because they were tired of handing a client to a different team at every stage. Their arrangement was simple: whoever takes the first call stays on the matter until it closes.',
      'That structure is still the firm. Sixty-four attorneys, three offices, and no practice group large enough for a client to become a file number. Managing partner Eleanor R. Vance has led the firm since 2014.',
    ],
    points: [
      'The partner who takes your first call argues the motion',
      'Fixed-fee arrangements available on transactional work',
      'Conflicts cleared within one business day, in writing',
    ],
  },

  services: {
    eyebrow: 'Practice areas',
    title: 'Six groups, one bench',
    subtitle:
      'Each group is led by a partner who practises in it daily. Matters that cross groups are staffed once, by the people already on them.',
    items: [
      {
        icon: Handshake,
        title: 'Mergers & Acquisitions',
        body: 'Buy-side and sell-side representation from letter of intent through closing, including carve-outs, take-privates and cross-border acquisitions.',
      },
      {
        icon: Landmark,
        title: 'Securities & Capital Markets',
        body: 'Public offerings, private placements, exchange listings and continuous disclosure obligations for issuers and underwriters.',
      },
      {
        icon: Gavel,
        title: 'Complex Commercial Litigation',
        body: 'Contract, fiduciary and shareholder disputes in state and federal court, and before the American Arbitration Association.',
      },
      {
        icon: ShieldCheck,
        title: 'Regulatory & Investigations',
        body: 'Representation before the SEC, the FTC and state attorneys general, including internal investigations reporting to the audit committee.',
      },
      {
        icon: Users,
        title: 'Employment & Executive Compensation',
        body: 'Executive agreements, equity plans, restrictive covenants and the workforce questions that follow a transaction.',
      },
      {
        icon: BookMarked,
        title: 'Intellectual Property & Technology',
        body: 'Licensing, technology transfer, data protection and the IP diligence that decides whether a deal is worth signing.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Meridian',
    title: 'What a client notices in the first month',
    subtitle: 'Four commitments the firm has made in writing since 1988, and still keeps.',
    items: [
      {
        icon: Scale,
        title: 'Partner-led, without exception',
        body: 'Every matter is run by a partner who reads the documents. Associates support the work; they do not inherit it.',
      },
      {
        icon: Banknote,
        title: 'Budgets you receive before the work',
        body: 'A written estimate accompanies every engagement letter, and any variance above ten percent is raised before it is incurred.',
      },
      {
        icon: Briefcase,
        title: 'Institutional memory',
        body: 'Median partner tenure is nineteen years, so the lawyer who negotiated your 2019 credit agreement is still the one who reads it.',
      },
      {
        icon: Building2,
        title: 'Three offices, one file',
        body: 'Boston, New York and Washington share a single matter record. Nothing is re-explained because the work crossed a state line.',
      },
    ],
  },

  faq: {
    eyebrow: 'Common questions',
    title: 'What prospective clients ask first',
    items: [
      {
        question: 'How does the firm bill?',
        answer:
          'Transactional matters are quoted as fixed fees or capped fees wherever scope allows. Litigation is billed hourly against a written budget, revisited at each stage. Invoices carry narrative detail by task, not by day.',
      },
      {
        question: 'Do you act for companies of our size?',
        answer:
          'Our clients range from Series A companies with a first institutional round to public issuers with a market capitalisation above four billion dollars. The engagement structure differs; the staffing rule does not.',
      },
      {
        question: 'How quickly can conflicts be cleared?',
        answer:
          'Within one business day. Send the counterparties and the subject matter to the intake address and you will receive a written clearance or a written decline, never silence.',
      },
      {
        question: 'Will the partner I meet actually run the matter?',
        answer:
          'Yes. The firm does not separate origination from execution. If a matter requires a different specialist, that partner joins the first meeting rather than replacing the one you met.',
      },
      {
        question: 'Does Meridian take matters outside the United States?',
        answer:
          'We lead cross-border transactions from the Boston and New York offices and instruct local counsel in the relevant jurisdiction, retaining responsibility for the deal as a whole. We do not hand a client to a referral firm.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Speak with a partner',
    subtitle:
      'Describe the matter in outline and we will respond within one business day with a partner name and a proposed structure. Sending this message does not create an attorney-client relationship.',
    fields: {
      name: 'Full name',
      email: 'Email address',
      message: 'Outline of the matter',
    },
    submit: 'Send enquiry',
    details: [
      { label: 'Principal office', value: 'One Chancery Court, 44 Beaufort Street, Boston, MA 02110' },
      { label: 'Telephone', value: '+1 (617) 555-0182' },
      { label: 'New matters', value: 'newmatters@meridianvance.example' },
    ],
  },

  footer: {
    tagline:
      'Meridian Vance LLP. Corporate, securities and litigation counsel to boards and institutional investors since 1988.',
    columns: [
      {
        title: 'Practices',
        links: ['Mergers & Acquisitions', 'Securities & Capital Markets', 'Litigation', 'Regulatory & Investigations'],
      },
      { title: 'The firm', links: ['Our history', 'Partners', 'Offices', 'Careers'] },
      { title: 'Notices', links: ['Terms of engagement', 'Privacy notice', 'Attorney advertising', 'Accessibility'] },
    ],
    legal:
      '© 2026 Meridian Vance LLP. Attorney advertising. Prior results do not guarantee a similar outcome.',
  },
};

/** Mastheads for the three dedicated pages, keyed by page id. */
export const MERIDIAN_PAGE_HEADS: Record<Exclude<MeridianPageId, 'home'>, MeridianPageHead> = {
  about: {
    eyebrow: 'The firm',
    title: 'Four partners, one rule, thirty-eight years',
    intro:
      'Meridian Vance LLP was formed in Boston in 1988 on a single working principle: the lawyer who takes the first call stays on the matter until it closes. Everything else about the firm follows from it.',
  },
  practices: {
    eyebrow: 'Practices',
    title: 'Where the firm does its work',
    intro:
      'Six groups, each led by a partner in daily practice. Below is what each group handles, the matters it has run, and the partner who answers for it.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Three offices, one matter record',
    intro:
      'New matters are cleared for conflicts within one business day. Correspondence on an existing matter should go to the partner leading it.',
  },
};

/** The practices page - the same six groups, told at depth. */
export const MERIDIAN_PRACTICES: MeridianPractice[] = [
  {
    name: 'Mergers & Acquisitions',
    summary:
      'Buy-side and sell-side representation across the full transaction, from the first letter of intent to the final post-closing adjustment. The group leads diligence, drafts and negotiates the definitive agreements, and manages the specialists a deal draws in.',
    matters: [
      'Sale of a family-held industrial manufacturer to a strategic acquirer for $410 million',
      'Take-private of a Nasdaq-listed software issuer by a sponsor consortium',
      'Carve-out of a European division, closing across four jurisdictions in eleven weeks',
    ],
    lead: 'Eleanor R. Vance',
  },
  {
    name: 'Securities & Capital Markets',
    summary:
      'Counsel to issuers and underwriters on registered offerings, private placements and the continuous disclosure obligations that follow. The group also advises audit committees on disclosure controls and Section 16 compliance.',
    matters: [
      'Initial public offering on the NYSE raising $286 million for a medical device issuer',
      'Rule 144A high-yield note offering for a regional healthcare operator',
      'Restatement disclosure and remediation programme for a public issuer',
    ],
    lead: 'Marcus Oyelaran',
  },
  {
    name: 'Complex Commercial Litigation',
    summary:
      'Contract, fiduciary and shareholder disputes tried in state and federal court and arbitrated before the American Arbitration Association. Matters are budgeted stage by stage, and the partner arguing the motion is the partner who took the call.',
    matters: [
      'Defence of a board against fiduciary duty claims arising from a merger, dismissed at the pleading stage',
      'Post-closing earn-out arbitration recovering $38 million for a selling shareholder group',
      'Trade secret injunction obtained in the District of Massachusetts within nine days of filing',
    ],
    lead: 'Priya Raghunathan',
  },
  {
    name: 'Regulatory & Government Investigations',
    summary:
      'Representation before the Securities and Exchange Commission, the Federal Trade Commission and state attorneys general, including internal investigations conducted for and reported to the audit committee.',
    matters: [
      'SEC enforcement inquiry concluded with no action following a voluntary submission',
      'Second request response in an FTC merger review, produced on a sixty-day schedule',
      'Independent internal investigation into revenue recognition, reported to the audit committee',
    ],
    lead: 'Daniel Whitcombe',
  },
  {
    name: 'Employment & Executive Compensation',
    summary:
      'Executive agreements, equity incentive plans, restrictive covenants and the workforce questions that arrive with a transaction: retention, redundancy, and the treatment of unvested awards on a change of control.',
    matters: [
      'Equity plan redesign for a company transitioning from private to public reporting',
      'Enforcement of non-solicitation covenants against a departing sales organisation',
      'Retention architecture covering 140 employees through an integration',
    ],
    lead: 'Ingrid Halvorsen',
  },
  {
    name: 'Intellectual Property & Technology',
    summary:
      'Licensing, technology transfer, data protection and the intellectual property diligence that decides whether a transaction is worth signing. The group also negotiates the commercial agreements that carry a product to market.',
    matters: [
      'Global licensing programme covering a portfolio of thirty-one patent families',
      'Data protection assessment and remediation ahead of a cross-border acquisition',
      'Master technology agreement for a platform serving regulated financial institutions',
    ],
    lead: 'Sofia Marchetti',
  },
];

/** The partners named across the site. Monograms stand in for photography. */
export const MERIDIAN_TEAM: MeridianPerson[] = [
  {
    initials: 'EV',
    name: 'Eleanor R. Vance',
    role: 'Managing Partner · Mergers & Acquisitions',
    focus:
      'Leads the firm and its M&A group. Twenty-two years advising boards on control transactions, with particular depth in founder-held businesses selling to strategic acquirers.',
    admissions: ['Massachusetts', 'New York', 'U.S. Supreme Court'],
  },
  {
    initials: 'MO',
    name: 'Marcus Oyelaran',
    role: 'Partner · Securities & Capital Markets',
    focus:
      'Counsel to issuers and underwriters on registered and exempt offerings. Formerly with the Division of Corporation Finance at the Securities and Exchange Commission.',
    admissions: ['New York', 'District of Columbia'],
  },
  {
    initials: 'PR',
    name: 'Priya Raghunathan',
    role: 'Partner · Complex Commercial Litigation',
    focus:
      'Tries fiduciary and contract disputes for boards and shareholder groups. Has argued nine appeals before the First Circuit and served as lead trial counsel in fourteen matters.',
    admissions: ['Massachusetts', 'U.S. Court of Appeals, First Circuit', 'U.S. Supreme Court'],
  },
  {
    initials: 'DW',
    name: 'Daniel Whitcombe',
    role: 'Partner · Regulatory & Investigations',
    focus:
      'Conducts internal investigations and represents companies before federal regulators. Previously an Assistant United States Attorney for the District of Massachusetts.',
    admissions: ['Massachusetts', 'District of Columbia'],
  },
];

/** The history rail on the firm page. */
export const MERIDIAN_MILESTONES: MeridianMilestone[] = [
  {
    year: '1988',
    title: 'The firm is formed',
    body: 'Four partners open an office on Beaufort Street with eleven clients and one rule about who stays on a matter.',
  },
  {
    year: '1997',
    title: 'Litigation group established',
    body: 'A trial practice is added so that transactional clients no longer need a second firm when a deal goes to dispute.',
  },
  {
    year: '2006',
    title: 'New York office opens',
    body: 'Capital markets work moves closer to the underwriters, and the firm adopts a single matter record across both offices.',
  },
  {
    year: '2014',
    title: 'Eleanor R. Vance becomes managing partner',
    body: 'The fixed-fee programme for transactional work is introduced, and written budgets become standard on every engagement.',
  },
  {
    year: '2021',
    title: 'Washington office opens',
    body: 'Regulatory and investigations work is placed alongside the agencies it appears before, completing the three-office structure.',
  },
];

/** Offices, addressed as correspondence would be. */
export const MERIDIAN_OFFICES: MeridianOffice[] = [
  {
    city: 'Boston',
    lines: ['One Chancery Court', '44 Beaufort Street', 'Boston, MA 02110'],
    phone: '+1 (617) 555-0182',
    hours: 'Monday to Friday, 8:30 to 18:00 ET',
  },
  {
    city: 'New York',
    lines: ['The Rowland Building', '280 Whitehall Plaza, 19th Floor', 'New York, NY 10004'],
    phone: '+1 (212) 555-0147',
    hours: 'Monday to Friday, 8:30 to 18:30 ET',
  },
  {
    city: 'Washington, D.C.',
    lines: ['Carrington House', '1120 Vermont Avenue NW, Suite 800', 'Washington, DC 20005'],
    phone: '+1 (202) 555-0119',
    hours: 'Monday to Friday, 9:00 to 18:00 ET',
  },
];

/**
 * Standing labels the multipage chrome needs. They are user-facing strings, so
 * they belong here rather than inline in a component - even the short ones.
 */
export const MERIDIAN_LABELS = {
  headerCta: 'Request a consultation',
  home: 'Home',
  practicesEyebrow: 'Representative matters',
  practicesLead: 'Group leader',
  teamEyebrow: 'Partners',
  teamTitle: 'The partners who answer for the work',
  teamSubtitle:
    'Four of the sixteen partners at Meridian Vance. Each leads a group and each carries matters personally.',
  admissionsLabel: 'Bar admissions',
  historyEyebrow: 'History',
  historyTitle: 'Thirty-eight years, five decisions',
  valuesEyebrow: 'Standards',
  valuesTitle: 'How the firm holds itself',
  officesEyebrow: 'Offices',
  officesTitle: 'Where to find us',
  hoursLabel: 'Hours',
  telephoneLabel: 'Telephone',
  formNotice:
    'Do not send confidential or time-sensitive information through this form. No attorney-client relationship is created until an engagement letter is signed.',
  formSuccess: 'Received. A partner will respond within one business day.',
  formSent: 'Enquiry sent',
  servicesMore: 'View all practice areas',
  homeCredentials: 'Recognition and memberships',
} as const;

/** The prompt a visitor copies to generate a site in this spirit. */
export const MERIDIAN_PROMPT = `Design a four-page website for a corporate law firm called Meridian (Meridian Vance LLP), founded in Boston in 1988. Pages: Home, The Firm, Practices, Contact.

Art direction:
- Authoritative and institutional, the opposite of a startup page. Deep navy #0f1d33 for the masthead, footers and inverted bands; warm ivory #f7f5f0 for the reading surfaces; a single muted gold #b08d4f used only for rules, small-caps eyebrows and one hairline button border.
- Type carries the formality: a classic transitional serif for every heading and display numeral, and a clean neutral sans at a modest size for body copy, labels and navigation. Eyebrows are sans, uppercase, letterspaced to 0.28em, in gold.
- Strong horizontal rules. A 1px gold rule under every section eyebrow, a hairline navy rule between every band, and lists divided by rules rather than boxed in cards.
- Symmetrical, formal layout: centred mastheads on every page, even column grids, generous margins, nothing tilted or offset.
- No photography and no icons that read as playful. Partner portraits are serif monograms inside a thin-ruled square. Ornament is drawn with CSS gradients only - a fine diagonal hatch behind the navy hero, and a gold hairline crest.

Structure: a shared masthead with the firm name in letterspaced serif and query-string nav links, plus a shared footer with three link columns and an attorney-advertising notice. Home carries a navy hero with three understated figures, an accolades strip, a six-item practice preview, a "why us" grid and an FAQ accordion. The Firm page carries the founding story, a dated history rail and partner monograms with bar admissions. Practices lists each group at length with representative matters and the partner who leads it. Contact carries three office addresses and an enquiry form beside a disclaimer.

Motion: restrained. Fades only, no vertical travel, no parallax, no hover lifts. Figures count up once. Everything is static under prefers-reduced-motion.

Voice: formal, precise, understated. Real addresses, real bar admissions, real matter descriptions with figures. No exclamation marks and no marketing adjectives.`;
