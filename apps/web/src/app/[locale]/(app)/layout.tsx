import type { ReactNode } from 'react';
import { FullMessages } from '@/i18n/client-messages';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { QuotaToasts } from '@/components/entitlements/quota-toasts';

/** Responsive dashboard shell: persistent sidebar + sticky topbar. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    // The whole shell, not just `children`: the sidebar and topbar are client
    // components that read translations too, so a provider wrapped around the
    // page alone would leave them without a catalogue.
    <FullMessages>
      <div className="flex h-screen overflow-hidden">
        {/* Renders nothing: watches the shared usage query and warns when a quota
            crosses into "nearly out" or "spent". Here rather than per page, since
            a limit can run out on any of them. */}
        <QuotaToasts />
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </FullMessages>
  );
}
