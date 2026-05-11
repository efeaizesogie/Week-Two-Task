'use client';

import { FileText, Home, Library, Settings, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@rfpilot/ui';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/rfps', label: 'RFPs', icon: FileText },
  { href: '/dashboard/library', label: 'Answer Library', icon: Library },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/billing', label: 'Billing', icon: Sparkles },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card/40 md:block">
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5 text-lg font-semibold">
        <span className="inline-block h-6 w-6 rounded bg-primary" aria-hidden />
        RFPilot
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors',
                'hover:bg-accent hover:text-foreground',
                active && 'bg-accent text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
