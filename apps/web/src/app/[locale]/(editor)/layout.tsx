import type { ReactNode } from 'react';

/**
 * Full-viewport shell for editor routes.
 *
 * Sits outside the `(app)` group on purpose: an editor owns the whole viewport
 * and brings its own chrome, so the sidebar and topbar would only compete with
 * it for space. It still inherits the `[locale]` root layout - html/body,
 * globals.css, providers - which is all an editor needs.
 */
export default function EditorLayout({ children }: { children: ReactNode }) {
  return <div className="h-dvh overflow-hidden">{children}</div>;
}
