import { UserButton } from '@clerk/nextjs';

import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur">
          <div className="text-sm text-muted-foreground">Workspace</div>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
