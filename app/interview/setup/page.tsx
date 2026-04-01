'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/ui/AuthGuard';
import { InterviewRound } from '@/types';
import { Clock, CheckCircle, Play, Terminal, Mic, BarChart2, List } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function InterviewSetup() {
  const [rounds, setRounds] = useState<InterviewRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get('role') || '';
  const level = searchParams.get('level') || '';
  const resume = searchParams.get('resume') || '';

  useEffect(() => {
    generateInterviewStructure();
  }, []);

  const generateInterviewStructure = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/generate-rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, experienceLevel: level })
      });

      if (!response.ok) {
        throw new Error('Failed to generate rounds');
      }

      const data = await response.json();

      if (data.rounds && Array.isArray(data.rounds)) {
        setRounds(data.rounds);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to generate interview structure. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    if (rounds.length > 0) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          role,
          experience_level: level,
          rounds
        })
      });

      const data = await response.json();

      const sessionData = {
        sessionId: data.session?.id || Date.now(),
        role,
        level,
        resume,
        rounds,
        currentRound: 0
      };

      localStorage.setItem('interviewSession', JSON.stringify(sessionData));
      router.push('/interview/round?roundIndex=0');
    }
  };

  const getRoundIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return <Terminal className="h-4 w-4 text-emerald-400" />;
      case 'Coding': return <Terminal className="h-4 w-4 text-blue-400" />;
      case 'Voice': return <Mic className="h-4 w-4 text-purple-400" />;
      case 'Case': return <BarChart2 className="h-4 w-4 text-amber-400" />;
      default: return <List className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Building Pipeline..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4 text-black dark:text-white">
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-red-500/20 p-8 rounded-lg text-center max-w-md w-full">
          <p className="text-red-400 mb-6 text-sm font-medium">{error}</p>
          <button
            onClick={generateInterviewStructure}
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded font-medium text-sm hover:bg-zinc-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white dark:bg-black py-12 px-6 text-black dark:text-white">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 border-b border-zinc-300 dark:border-zinc-800 pb-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight">Pipeline Ready</h1>
            <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Role: <span className="text-black dark:text-white capitalize">{role}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Level: <span className="text-black dark:text-white capitalize">{level}</span>
              </div>
            </div>
          </div>

          {/* Interview Structure */}
          <div className="space-y-4 mb-12">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Session Modules</h2>
            {rounds.map((round, index) => (
              <motion.div
                key={round.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-300 dark:border-zinc-800 rounded-lg group"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    {getRoundIcon(round.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-black dark:text-white text-base">Round {index + 1}: {round.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{round.focus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pl-14 sm:pl-0">
                  <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-800">
                    <Clock className="h-3 w-3" />
                    {round.type === 'MCQ' ? `${round.questionCount} Qs` :
                      round.type === 'Coding' ? `${round.taskCount} Tasks` : 'Live'}
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500/80 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                    <CheckCircle className="h-3 w-3" />
                    Pass: {round.passCriteria}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-medium text-black dark:text-white mb-4">Pre-flight Checks</h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" /> Stable internet connection</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" /> Quiet environment</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" /> Permissions granted (Mic/Cam)</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" /> ~45 minutes uninterrupted</li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center pt-8 border-t border-zinc-300 dark:border-zinc-800">
            <button
              onClick={startInterview}
              className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-lg font-medium text-base transition-all flex items-center mx-auto gap-2"
            >
              <Play className="h-4 w-4 fill-current" />
              Begin Simulation
            </button>
            <p className="mt-4 text-xs text-zinc-600">
              Session progress is auto-saved.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function ProtectedInterviewSetup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <InterviewSetup />
    </Suspense>
  );
}