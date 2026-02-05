'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {
  Plus, Calendar, TrendingUp, Award, Clock, CheckCircle,
  Brain, Target, BookOpen, Zap, Star, Trophy,
  BarChart3, Users, MessageCircle, Download,
  Play, ArrowRight, ChevronRight, Sparkles, User as UserIcon
} from 'lucide-react';

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'Charan',
    role: 'Frontend Developer',
    level: 'Level 2 – Skilled Learner',
    skillScore: 82,
    completedRounds: 3,
    totalRounds: 5
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
    loadSessions();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUser(user);
    if (user.email) {
      setUserProfile(prev => ({ ...prev, name: user.email!.split('@')[0] }));
    }
  };

  const loadSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setSessions(data || []);

    if (data && data.length > 0) {
      const avgScore = Math.round(data.reduce((acc, s) => acc + s.overall_score, 0) / data.length);
      const completedCount = data.filter(s => s.status === 'completed').length;
      setUserProfile(prev => ({
        ...prev,
        skillScore: avgScore,
        completedRounds: completedCount
      }));
    }

    setLoading(false);
  };

  const startNewInterview = () => {
    router.push('/start-interview');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-400">Welcome back, <span className="text-indigo-400 font-medium capitalize">{userProfile.name}</span></p>
          </div>
          <button
            onClick={startNewInterview}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2 font-medium active:scale-95"
          >
            <Plus className="h-5 w-5" />
            New Simulation
          </button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Interviews', value: sessions.length, icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { label: 'Average Score', value: `${sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.overall_score, 0) / sessions.length) : 0}%`, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Completed', value: sessions.filter(s => s.status === 'completed').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Success Rate', value: `${sessions.length > 0 ? Math.round((sessions.filter(s => s.overall_score >= 70).length / sessions.length) * 100) : 0}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-slate-800/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Actions removed/merged - keeping streamlined */}

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl border border-slate-800/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/40">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" /> Recent Activity
                </h2>
              </div>

              <div className="divide-y divide-slate-800/50">
                {sessions.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                      <Calendar className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No interviews yet</h3>
                    <p className="text-slate-500 mb-6">Start your first interview to see your progress here</p>
                    <button
                      onClick={startNewInterview}
                      className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      Start Interview →
                    </button>
                  </div>
                ) : (
                  sessions.slice(0, 5).map((session, i) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="p-6 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{session.role}</h3>
                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wide font-bold rounded-full ${session.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                              {session.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{session.experience_level} • {new Date(session.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white mb-1">
                            {session.overall_score}%
                          </div>
                          <div className={`text-xs font-medium ${session.overall_score >= 80 ? 'text-emerald-400' :
                              session.overall_score >= 60 ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                            Score
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl border border-slate-800/50 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6">Skill Analysis</h3>
              <div className="space-y-6">
                {[
                  { label: 'Technical Accuracy', score: 78, color: 'bg-indigo-500' },
                  { label: 'Communication', score: 92, color: 'bg-emerald-500' },
                  { label: 'Problem Solving', score: 85, color: 'bg-violet-500' }
                ].map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">{skill.label}</span>
                      <span className="text-white font-medium">{skill.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${skill.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Learning Path */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl border border-slate-800/50 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Recommended Path</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="text-sm font-medium text-emerald-200">System Design: Scaling</div>
                    <div className="text-xs text-emerald-500/60">Next Module</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                  <div className="h-2 w-2 rounded-full bg-slate-600" />
                  <div>
                    <div className="text-sm font-medium text-slate-400">Advanced React Patterns</div>
                    <div className="text-xs text-slate-600">Locked</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl border border-slate-800/50 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> AI Insights
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <div className="text-xs text-indigo-300 font-medium mb-1">Focus Area</div>
                  <div className="text-sm text-white">Review Big O notation for graph algorithms.</div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <div className="text-xs text-emerald-300 font-medium mb-1">Strength</div>
                  <div className="text-sm text-white">Excellent structured answers in behavioral rounds.</div>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedDashboard() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}