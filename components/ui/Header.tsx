'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Command, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import UserMenu from './UserMenu';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
            <Command className="h-4 w-4" />
          </div>
          <span className="font-semibold text-black dark:text-white tracking-tight">InterviewAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:text-white'}`}
              >
                Dashboard
              </Link>
              <Link
                href="/start-interview"
                className={`text-sm font-medium transition-colors ${pathname === '/start-interview' ? 'text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:text-white'}`}
              >
                New Session
              </Link>

              <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />

              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-3">
                  <UserMenu />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/auth"
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="block text-sm font-medium text-white" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/start-interview" className="block text-sm font-medium text-white" onClick={() => setIsMenuOpen(false)}>
                    New Session
                  </Link>
                  <div className="pt-4 border-t border-zinc-900">
                    <p className="text-xs text-zinc-500 mb-3">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/auth" className="block text-sm font-medium text-white" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}