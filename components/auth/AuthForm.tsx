'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Loader2, Command } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px]"
      >
        <div className="bg-white dark:bg-black sm:border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:p-8 sm:shadow-sm">
          <div className="text-center mb-8">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-lg mx-auto flex items-center justify-center mb-6">
              <Command className="h-5 w-5 text-white dark:text-black" />
            </div>
            <h2 className="text-2xl font-semibold text-black dark:text-white tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-zinc-500 text-sm">
              {isLogin ? 'Enter your credentials to continue.' : 'Start your journey to interview mastery.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white rounded-lg py-2.5 px-3 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white rounded-lg py-2.5 px-3 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-sm"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 overflow-hidden"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
               type="submit"
               disabled={loading}
               className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors text-xs font-medium"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-black dark:text-white ml-1">Sign up &rarr;</span></>
              ) : (
                <>Already have an account? <span className="text-black dark:text-white ml-1">Sign in &rarr;</span></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}