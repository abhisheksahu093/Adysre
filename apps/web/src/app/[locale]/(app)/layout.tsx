import type { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';

/** Responsive dashboard shell: persistent sidebar + sticky topbar. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
