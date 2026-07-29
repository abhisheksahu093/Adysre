import type { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { QuotaToasts } from '@/components/entitlements/quota-toasts';

/** Responsive dashboard shell: persistent sidebar + sticky topbar. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
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
  );
}
