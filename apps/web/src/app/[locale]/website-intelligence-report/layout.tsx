import type { ReactNode } from 'react';
import { FullMessages } from '@/i18n/client-messages';

/**
 * Adds nothing to the DOM; exists only to give this route tree a message
 * catalogue.
 *
 * The root layout ships just the namespaces its own chrome needs, so any route
 * outside the `(app)`, `(auth)` and `(editor)` groups has to say what it wants.
 * A report is a signed-in view whose weight nobody is optimising for, so it
 * takes the lot rather than carrying a list to keep in step.
 */
export default function WebsiteIntelligenceReportLayout({ children }: { children: ReactNode }) {
  return <FullMessages>{children}</FullMessages>;
}
