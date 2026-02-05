'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/ui/AuthGuard';
import { InterviewRound } from '@/types';
import { Clock, CheckCircle, Play, Sparkles, Terminal, Mic, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
      const data = await response.json();
      setRounds(data.rounds);
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
      case 'MCQ': return <Terminal className="h-6 w-6 text-emerald-400" />;
      case 'Coding': return <Terminal className="h-6 w-6 text-blue-400" />;
      case 'Voice': return <Mic className="h-6 w-6 text-purple-400" />;
      case 'Case': return <BarChart2 className="h-6 w-6 text-amber-400" />;
      default: return <Sparkles className="h-6 w-6 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
        <div className="w-16 h-16 relative mb-8">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-t-2 border-l-2 border-violet-500 animate-spin-reverse" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Generating Simulation</h2>
        <p className="text-slate-400 animate-pulse">Analyzing role requirements and structuring rounds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="glass-card p-8 rounded-2xl text-center max-w-md w-full border border-rose-500/30">
          <p className="text-rose-400 mb-6 text-lg font-medium">{error}</p>
          <button
            onClick={generateInterviewStructure}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-500 transition-colors w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 mb-8 border border-slate-800/50"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Simulation Ready</h1>
                <p className="text-slate-400">Review your generated interview pipeline below.</p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-500 block">Target Role</span>
                  <span className="text-sm font-semibold text-white capitalize">{role}</span>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-500 block">Level</span>
                  <span className="text-sm font-semibold text-white capitalize">{level}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interview Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-8 mb-8 border border-slate-800/50"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> Pipeline Structure
            </h2>

            <div className="space-y-4">
              {rounds.map((round, index) => (
                <motion.div
                  key={round.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.2 }}
                  className="flex flex-col md:flex-row md:items-center p-5 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-indigo-500/30 transition-colors group"
                >
                  <div className="flex items-start md:items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mr-5 group-hover:bg-slate-700 transition-colors">
                      {getRoundIcon(round.type)}
                    </div>

                    <div className="mr-8">
                      <h3 className="font-bold text-white text-lg">Round {index + 1}: {round.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{round.focus}</p>
                    </div>
                  </div>

                  <div className="flex-grow flex items-center gap-6 text-sm text-slate-400 md:ml-auto md:justify-end">
                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                      <Clock className="h-3.5 w-3.5" />
                      {round.type === 'MCQ' ? `${round.questionCount} Qs` :
                        round.type === 'Coding' ? `${round.taskCount} Tasks` : 'Live'}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Pass: {round.passCriteria}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 mb-8"
          >
            <h3 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block animate-pulse" /> Tips for Success
            </h3>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-500 rounded-full" /> Ensure stable internet connection</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-500 rounded-full" /> Find a quiet environment for voice rounds</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-500 rounded-full" /> Allow microphone/camera permissions</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-500 rounded-full" /> Speak clearly and pace yourself</li>
            </ul>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={startInterview}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all flex items-center mx-auto gap-3"
            >
              <Play className="h-5 w-5 fill-current" />
              Begin Simulation
            </button>
            <div className="mt-4">
              {!role && <span className="text-sm text-slate-500">Note: Session progress will be saved automatically</span>}
            </div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function ProtectedInterviewSetup() {
  return <InterviewSetup />;
}