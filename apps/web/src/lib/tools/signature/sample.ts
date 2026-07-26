import type { SignatureData } from './types';
import { SIGNATURE_THEMES_BY_ID } from './themes';

/** Starting signature so the preview reads as a real one on load. */
export const SAMPLE_SIGNATURE: SignatureData = {
  name: 'Ravi Sharma',
  designation: 'Head of Product',
  company: 'Acme Studio',
  phone: '+1 555 010 2040',
  mobile: '+1 555 900 1122',
  email: 'ravi@acme.studio',
  website: 'acme.studio',
  address: '18 Market Street, San Francisco, CA',
  logo: '',
  photo: '',
  banner: '',
  cta: { label: 'Book a call', url: 'https://acme.studio/book' },
  socials: [
    { platform: 'linkedin', url: 'https://linkedin.com/in/ravi' },
    { platform: 'x', url: 'https://x.com/ravi' },
    { platform: 'github', url: 'https://github.com/ravi' },
  ],
  themeId: 'modern',
  design: { ...SIGNATURE_THEMES_BY_ID.modern!.design },
};
