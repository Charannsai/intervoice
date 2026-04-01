'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {
  Plus, Calendar, Activity,
  BarChart3, CheckCircle2, Clock,
  ArrowRight, Terminal
} from 'lucide-react';

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'Engineer',
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
    return <LoadingSpinner fullScreen text="Loading data..." />;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Overview</h1>
            <p className="text-zinc-400 text-sm">Welcome back, {userProfile.name}</p>
          </div>
          <button
            onClick={startNewInterview}
            className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-md transition-colors flex items-center gap-2 font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            New Session
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Sessions', value: sessions.length, icon: Terminal },
            { label: 'Avg. Score', value: `${sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.overall_score, 0) / sessions.length) : 0}%`, icon: Activity },
            { label: 'Completed', value: sessions.filter(s => s.status === 'completed').length, icon: CheckCircle2 },
            { label: 'Hours Practiced', value: '12.5', icon: Clock },
          ].map((stat, i) => (
            <div key={stat.label} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-zinc-600" />
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Activity (Wide) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
              {sessions.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-zinc-500 mb-4">No recent activity found.</p>
                  <button onClick={startNewInterview} className="text-white underline text-sm">Start your first session</button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="p-4 hover:bg-zinc-900/50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${session.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <div>
                          <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{session.role}</h3>
                          <p className="text-xs text-zinc-500">{new Date(session.created_at).toLocaleDateString()} • {session.experience_level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-zinc-300">{session.overall_score}%</span>
                        <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            {/* Skills */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Skill Capability</h2>
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 space-y-6">
                {[
                  { label: 'System Design', val: 78 },
                  { label: 'Algorithms', val: 92 },
                  { label: 'Communication', val: 85 }
                ].map(skill => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-zinc-400">{skill.label}</span>
                      <span className="text-white font-mono">{skill.val}/100</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${skill.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Recommended</h2>
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Terminal className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Graph Traversal Patterns</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                      Based on your last session, we recommend reviewing BFS/DFS implementation patterns.
                    </p>
                    <button className="text-xs text-white border-b border-white/30 hover:border-white pb-0.5 transition-colors">Start Module</button>
                  </div>
                </div>
              </div>
            </div>
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