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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InterviewAI</h1>
                <span className="text-xs text-gray-500">Enterprise Edition</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </a>
                <a href="/start-interview" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  New Interview
                </a>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/auth" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Sign In
                </a>
                <a href="/auth" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                  Get Started
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {user ? (
              <div className="space-y-4">
                <a href="/dashboard" className="block text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </a>
                <a href="/start-interview" className="block text-gray-700 hover:text-blue-600 font-medium">
                  New Interview
                </a>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <a href="/auth" className="block text-gray-700 hover:text-blue-600 font-medium">
                  Sign In
                </a>
                <a href="/auth" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                  Get Started
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}