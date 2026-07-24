import type { SignatureData } from './types';
import { SOCIAL_META } from './themes';

/**
 * The signature builder: structured data to table-based, inline-styled HTML.
 *
 * Everything email clients render reliably and nothing they strip: a `<table>`
 * layout (no flexbox/grid, which Outlook ignores), inline styles only (clients
 * drop `<style>`), width/height on images, and self-contained social chips
 * (colored `<a>` tags, no external icon requests). All user values are
 * HTML-escaped and URLs are scheme-checked, so the output is safe by
 * construction; the client sanitizes again with DOMPurify before copy.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Allow only safe link schemes; anything else becomes an empty anchor target. */
export function safeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  if (/^(https?:|mailto:|tel:)/i.test(value)) return escapeHtml(value);
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(value)) return `mailto:${escapeHtml(value)}`;
  if (/^[+\d][\d\s()-]{5,}$/.test(value)) return `tel:${escapeHtml(value.replace(/\s/g, ''))}`;
  return escapeHtml(`https://${value.replace(/^\/+/, '')}`);
}

function contactRow(label: string, value: string, href: string, d: SignatureData['design']): string {
  if (!value.trim()) return '';
  const inner = href
    ? `<a href="${href}" style="color:${d.textColor};text-decoration:none">${escapeHtml(value)}</a>`
    : escapeHtml(value);
  return `<div style="margin:2px 0;font-size:13px;color:${d.textColor}"><span style="color:${d.mutedColor}">${label}</span> ${inner}</div>`;
}

export function buildSignatureHtml(data: SignatureData): string {
  const d = data.design;
  const radius = d.roundedImages ? '50%' : '6px';

  const photoCell =
    data.photo || data.logo
      ? `<td valign="top" style="padding-right:${d.spacing + 8}px">
          ${data.photo ? `<img src="${escapeHtml(data.photo)}" width="${d.photoSize}" height="${d.photoSize}" alt="" style="display:block;border-radius:${radius};object-fit:cover;margin-bottom:8px" />` : ''}
          ${data.logo ? `<img src="${escapeHtml(data.logo)}" width="${d.logoWidth}" alt="" style="display:block;max-width:${d.logoWidth}px;height:auto" />` : ''}
        </td>`
      : '';

  const divider = d.showDividers
    ? `<div style="border-top:1px solid ${d.mutedColor}33;margin:${d.spacing}px 0"></div>`
    : `<div style="height:${d.spacing}px"></div>`;

  const contacts = [
    contactRow('P', data.phone, safeUrl(data.phone), d),
    contactRow('M', data.mobile, safeUrl(data.mobile), d),
    contactRow('E', data.email, safeUrl(data.email), d),
    contactRow('W', data.website, safeUrl(data.website), d),
    contactRow('A', data.address, '', d),
  ].join('');

  const socials = data.socials
    .filter((s) => s.url.trim())
    .map((s) => {
      const meta = SOCIAL_META[s.platform];
      const size = d.iconSize;
      return `<a href="${safeUrl(s.url)}" title="${meta.label}" style="display:inline-block;width:${size}px;height:${size}px;line-height:${size}px;text-align:center;background:${meta.color};color:#ffffff;border-radius:${d.roundedImages ? '50%' : '6px'};font-size:${Math.round(size * 0.42)}px;font-weight:700;text-decoration:none;margin-right:6px">${meta.short}</a>`;
    })
    .join('');
  const socialRow = socials ? `<div style="margin-top:${d.spacing + 2}px">${socials}</div>` : '';

  const cta =
    data.cta.label.trim() && data.cta.url.trim()
      ? `<div style="margin-top:${d.spacing + 4}px"><a href="${safeUrl(data.cta.url)}" style="display:inline-block;padding:9px 18px;background:${d.accentColor};color:#ffffff;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none">${escapeHtml(data.cta.label)}</a></div>`
      : '';

  const banner = data.banner
    ? `<tr><td colspan="2" style="padding-top:${d.spacing + 8}px"><a href="${safeUrl(data.cta.url || data.website)}"><img src="${escapeHtml(data.banner)}" alt="" style="display:block;max-width:100%;height:auto;border-radius:6px" /></a></td></tr>`
    : '';

  const border = d.showBorder ? `border:1px solid ${d.mutedColor}44;border-radius:8px;` : '';

  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:${d.font};background:${d.background};${border}padding:${d.showBorder ? '16px' : '0'}">
  <tr>
    ${photoCell}
    <td valign="top">
      <div style="font-size:18px;font-weight:700;color:${d.primaryColor};line-height:1.2">${escapeHtml(data.name || 'Your Name')}</div>
      ${data.designation ? `<div style="font-size:14px;color:${d.mutedColor};margin-top:2px">${escapeHtml(data.designation)}</div>` : ''}
      ${data.company ? `<div style="font-size:14px;font-weight:600;color:${d.accentColor};margin-top:2px">${escapeHtml(data.company)}</div>` : ''}
      ${divider}
      ${contacts}
      ${socialRow}
      ${cta}
    </td>
  </tr>
  ${banner}
</table>`;
}
