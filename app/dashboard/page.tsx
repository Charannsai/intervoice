'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import { User } from '@supabase/supabase-js';
import { 
  Plus, Calendar, TrendingUp, Award, Clock, CheckCircle, 
  Brain, Target, BookOpen, Zap, Star, Trophy, 
  BarChart3, Users, MessageCircle, Download,
  Play, ArrowRight, ChevronRight, Sparkles
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userProfile.name}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-medium text-gray-900">{sessions.length}</div>
            <div className="text-sm text-gray-500">Total Interviews</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-medium text-gray-900">
              {sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.overall_score, 0) / sessions.length) : 0}%
            </div>
            <div className="text-sm text-gray-500">Average Score</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-medium text-gray-900">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-medium text-gray-900">
              {sessions.length > 0 ? Math.round((sessions.filter(s => s.overall_score >= 70).length / sessions.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={startNewInterview}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-left flex items-center"
                >
                  <Plus className="h-4 w-4 mr-3" />
                  Start New Interview
                </button>
                <button className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center">
                  <BookOpen className="h-4 w-4 mr-3" />
                  View Learning Path
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-medium text-gray-900">{session.role}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{session.overall_score}%</div>
                      <div className={`text-sm ${
                        session.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {session.status}
                      </div>
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No interviews completed yet
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Performance Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Technical</span>
                  <div className="flex items-center">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div className="w-3/4 h-1.5 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-900">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Communication</span>
                  <div className="flex items-center">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div className="w-4/5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-900">82%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Problem Solving</span>
                  <div className="flex items-center">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div className="w-4/5 h-1.5 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-900">85%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Learning Path */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Path</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">JavaScript Basics</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-blue-600 rounded-full mr-3 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">React Fundamentals</div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">System Design</div>
                    <div className="text-xs text-gray-500">Locked</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Insights */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Insights</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-900">Focus Area</div>
                  <div className="text-xs text-gray-600 mt-1">Improve algorithm complexity understanding</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-900">Strength</div>
                  <div className="text-xs text-gray-600 mt-1">Excellent communication skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview History */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Interview History</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                View All
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sessions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
                <p className="text-gray-500 mb-6">Start your first interview to see your progress here</p>
                <button
                  onClick={startNewInterview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Interview
                </button>
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900">{session.role}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          session.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{session.experience_level}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(session.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center space-x-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm">
                          Download Report
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-medium text-gray-900 mb-1">
                        {session.overall_score}%
                      </div>
                      <div className={`text-sm mb-2 ${
                        session.overall_score >= 80 ? 'text-green-600' :
                        session.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {session.overall_score >= 80 ? 'Excellent' :
                         session.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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