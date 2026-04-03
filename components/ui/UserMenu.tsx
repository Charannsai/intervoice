'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User as UserIcon, Palette, LogOut } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { icon: UserIcon, label: 'Profile', href: '/settings/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Palette, label: 'Theme', href: '/settings/theme' },
  ];

  const isInterviewFlow = pathname?.startsWith('/interview') || pathname?.startsWith('/start-interview');

  if (!user || isInterviewFlow) return null;

  const initial = user.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white hover:border-zinc-500 transition-colors focus:outline-none"
      >
        <span className="font-semibold text-sm">{initial}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-300 dark:border-zinc-800">
              <p className="text-sm font-medium text-black dark:text-white truncate">{user.email}</p>
              <p className="text-xs text-zinc-500 mt-1">Free Plan</p>
            </div>
            <div className="p-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(item.href);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:bg-zinc-800 hover:text-black dark:text-white rounded-lg transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-zinc-300 dark:border-zinc-800">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
