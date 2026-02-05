'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Rocket, Menu, X, LogOut, User as UserIcon, BarChart3 } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-slate-900/60 border border-slate-800/60 rounded-2xl shadow-lg transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">InterviewAI</h1>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Enterprise Edition</span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {user ? (
                <>
                  <a href="/dashboard" className="text-slate-300 hover:text-white font-medium transition-colors text-sm hover:text-glow">
                    Dashboard
                  </a>
                  <a href="/start-interview" className="text-slate-300 hover:text-white font-medium transition-colors text-sm hover:text-glow">
                    New Interview
                  </a>
                  <div className="flex items-center space-x-4 pl-4 border-l border-slate-700/50">
                    <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                      <UserIcon className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-6">
                  <a href="/auth" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">
                    Sign In
                  </a>
                  <a href="/auth" className="glass-button px-6 py-2 rounded-xl text-sm font-semibold hover:scale-105 active:scale-95 transition-all">
                    Get Started
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-800/50 py-4 px-4 bg-slate-900/90 rounded-b-2xl">
            {user ? (
              <div className="space-y-4">
                <a href="/dashboard" className="block text-slate-300 hover:text-white font-medium">
                  Dashboard
                </a>
                <a href="/start-interview" className="block text-slate-300 hover:text-white font-medium">
                  New Interview
                </a>
                <div className="pt-4 border-t border-slate-800/50">
                  <p className="text-sm text-slate-500 mb-3">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <a href="/auth" className="block text-slate-300 hover:text-white font-medium text-center">
                  Sign In
                </a>
                <a href="/auth" className="block bg-indigo-600 text-white px-4 py-3 rounded-xl text-center font-semibold text-sm">
                  Get Started
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}