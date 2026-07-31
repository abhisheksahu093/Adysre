import type { ReactNode } from 'react';
import { FullMessages } from '@/i18n/client-messages';

/**
 * Adds nothing to the DOM; exists only to give this route tree a message
 * catalogue.
 *
 * The root layout ships just the namespaces its own chrome needs, so any route
 * outside the `(app)`, `(auth)` and `(editor)` groups has to say what it wants.
 * A template renders a whole site's worth of sections, so the set it needs is
 * not knowable from here: it takes the lot.
 */
export default function TemplatePreviewLayout({ children }: { children: ReactNode }) {
  return <FullMessages>{children}</FullMessages>;
}
