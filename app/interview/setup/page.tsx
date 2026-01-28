'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/ui/AuthGuard';
import { InterviewRound } from '@/types';
import { Clock, CheckCircle, Play } from 'lucide-react';

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
      case 'MCQ': return '📝';
      case 'Coding': return '💻';
      case 'Voice': return '🎤';
      case 'Case': return '📊';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={generateInterviewStructure}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Setup Complete</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Role: <strong className="text-gray-900">{role}</strong></span>
            <span>Level: <strong className="text-gray-900">{level}</strong></span>
            {resume && <span>Resume: <strong className="text-gray-900">{resume}</strong></span>}
          </div>
        </div>

        {/* Interview Structure */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Interview Pipeline</h2>
          
          <div className="space-y-4">
            {rounds.map((round, index) => (
              <div key={round.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">{getRoundIcon(round.type)}</span>
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">Round {index + 1}: {round.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{round.focus}</p>
                  <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {round.type === 'MCQ' ? `${round.questionCount} questions` : 
                       round.type === 'Coding' ? `${round.taskCount} tasks` : 'Interactive'}
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pass: {round.passCriteria}%
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    round.type === 'MCQ' ? 'bg-green-100 text-green-800' :
                    round.type === 'Coding' ? 'bg-blue-100 text-blue-800' :
                    round.type === 'Voice' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {round.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-blue-900 mb-2">Before You Start</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure you have a stable internet connection</li>
            <li>• Find a quiet environment for voice rounds</li>
            <li>• Allow microphone access when prompted</li>
            <li>• Each round has a pass criteria - you must meet it to proceed</li>
            <li>• Take your time and think through each answer</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <div className="space-y-4">
            <button
              onClick={startInterview}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Interview
            </button>
            <div className="text-center">
              <a href="/auth" className="text-blue-600 hover:text-blue-500 text-sm">
                Login to save your progress
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function ProtectedInterviewSetup() {
  return <InterviewSetup />;
}