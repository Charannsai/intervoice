'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import { Award, TrendingUp, Clock, CheckCircle2, Download, Home, RotateCcw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function InterviewResults() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadResults = () => {
      const stored = localStorage.getItem('interviewResults');
      if (stored) {
        const data = JSON.parse(stored);
        setSessionData(data);
        updateSessionInDB(data);
      }
      setLoading(false);
    };
    loadResults();
  }, []);

  const updateSessionInDB = async (data: any) => {
    if (data.sessionId) {
      await fetch('/api/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: data.sessionId,
          overall_score: data.overallScore,
          status: 'completed'
        })
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-500 text-sm font-mono">Generating Report...</p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">No Results Found</h2>
          <p className="text-zinc-500 text-sm mb-6">Complete an interview session to generate a report.</p>
          <button
            onClick={() => router.push('/start-interview')}
            className="bg-white text-black px-6 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-6">
            <Award className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Performace Report</h1>
          <p className="text-zinc-400 text-sm">Detailed analysis of your interview session</p>
        </div>

        {/* Overall Score */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-1">Overall Score</div>
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(sessionData.overallScore)}`}>
                {sessionData.overallScore}%
              </div>
              <div className="text-lg font-medium text-white">
                {getScoreLabel(sessionData.overallScore)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Role</div>
                <div className="font-medium text-white">{sessionData.role || 'N/A'}</div>
              </div>
              <div className="bg-black/50 p-4 rounded border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Level</div>
                <div className="font-medium text-white">{sessionData.level || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Round Breakdown */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Module Breakdown</h2>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
            {sessionData.roundResults?.map((round: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-xs font-mono text-zinc-400">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">{round.name}</h3>
                    <p className="text-xs text-zinc-500">{round.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(round.score)}`}>
                    {round.score}%
                  </div>
                  <div className={`text-xs ${round.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                    {round.passed ? 'Pass' : 'Fail'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Key Strengths
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              {sessionData.overallScore >= 80 && <li className="flex gap-2"><span>•</span> Excellent technical depth</li>}
              {sessionData.overallScore >= 60 && <li className="flex gap-2"><span>•</span> Solid problem-solving foundations</li>}
              <li className="flex gap-2"><span>•</span> Completed full pipeline</li>
              <li className="flex gap-2"><span>•</span> Clear communication style</li>
            </ul>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              Focus Areas
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              {sessionData.overallScore < 80 && <li className="flex gap-2"><span>•</span> Review core algorithm complexities</li>}
              {sessionData.overallScore < 60 && <li className="flex gap-2"><span>•</span> Practice system design patterns</li>}
              <li className="flex gap-2"><span>•</span> Refine edge-case handling</li>
              <li className="flex gap-2"><span>•</span> Structure answers with STAR method</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center px-6 py-3 border border-zinc-700 text-white rounded-md hover:bg-zinc-900 transition-colors text-sm font-medium"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/start-interview')}
            className="flex items-center justify-center px-6 py-3 bg-white text-black rounded-md hover:bg-zinc-200 transition-colors text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            New Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedInterviewResults() {
  return (
    <AuthGuard>
      <InterviewResults />
    </AuthGuard>
  );
}