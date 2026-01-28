'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/ui/AuthGuard';
import { Award, TrendingUp, Clock, CheckCircle, Download, Home, RotateCcw } from 'lucide-react';

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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">Complete an interview to see your results here.</p>
          <button
            onClick={() => router.push('/start-interview')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Complete!</h1>
          <p className="text-xl text-gray-600">Here's how you performed</p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(sessionData.overallScore)}`}>
              {sessionData.overallScore}%
            </div>
            <div className={`text-2xl font-semibold ${getScoreColor(sessionData.overallScore)}`}>
              {getScoreLabel(sessionData.overallScore)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{sessionData.role}</div>
              <div className="text-gray-600">Position</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{sessionData.level}</div>
              <div className="text-gray-600">Experience Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{sessionData.rounds?.length || 0}</div>
              <div className="text-gray-600">Rounds Completed</div>
            </div>
          </div>
        </div>

        {/* Round Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Round-wise Performance</h2>
          <div className="space-y-4">
            {sessionData.roundResults?.map((round: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{round.name}</h3>
                    <p className="text-sm text-gray-600">{round.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(round.score)}`}>
                    {round.score}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {round.passed ? 'Passed' : 'Failed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Insights</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2 text-gray-700">
                {sessionData.overallScore >= 80 && <li>• Excellent technical knowledge</li>}
                {sessionData.overallScore >= 60 && <li>• Good problem-solving approach</li>}
                <li>• Completed all interview rounds</li>
                <li>• Demonstrated relevant experience</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2 text-gray-700">
                {sessionData.overallScore < 80 && <li>• Focus on technical fundamentals</li>}
                {sessionData.overallScore < 60 && <li>• Practice more coding problems</li>}
                <li>• Improve communication clarity</li>
                <li>• Practice behavioral questions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/start-interview')}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Take Another Interview
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