'use client';

import { usePathname, useRouter } from 'next/navigation';
import { User, Settings, Palette, ArrowLeft } from 'lucide-react';
import AuthGuard from '@/components/ui/AuthGuard';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Profile', href: '/settings/profile', icon: User },
    { label: 'General', href: '/settings', icon: Settings },
    { label: 'Theme', href: '/settings/theme', icon: Palette },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 flex-shrink-0">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/settings' && pathname?.startsWith(item.href));
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                        isActive 
                          ? 'bg-zinc-800 text-white' 
                          : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </aside>
            <main className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 min-h-[500px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
