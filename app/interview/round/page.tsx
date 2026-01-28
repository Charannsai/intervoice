'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InterviewSession, InterviewRound } from '@/types';
import MCQRound from '@/components/rounds/MCQRound';
import VoiceRound from '@/components/rounds/VoiceRound';
import CodingRound from '@/components/rounds/CodingRound';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function RoundPage() {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentRound, setCurrentRound] = useState<InterviewRound | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionData = localStorage.getItem('interviewSession');
    const roundIndexParam = searchParams.get('roundIndex');
    
    if (sessionData && roundIndexParam !== null) {
      const parsedSession = JSON.parse(sessionData);
      const index = parseInt(roundIndexParam);
      
      setSession(parsedSession);
      setRoundIndex(index);
      setCurrentRound(parsedSession.rounds[index]);
    } else {
      router.push('/');
    }
  }, [searchParams]);

  const handleRoundComplete = (score: number, data: any) => {
    setRoundScore(score);
    const roundPassed = score >= (currentRound?.passCriteria || 60);
    setPassed(roundPassed);
    setShowResult(true);

    // Update session with score
    if (session) {
      const updatedSession = {
        ...session,
        scores: {
          ...session.scores,
          [currentRound?.id || '']: score
        }
      };
      localStorage.setItem('interviewSession', JSON.stringify(updatedSession));
    }
  };

  const proceedToNext = () => {
    if (!session) return;

    if (passed && roundIndex < session.rounds.length - 1) {
      // Reset state and go to next round
      setShowResult(false);
      setRoundScore(0);
      setPassed(false);
      const nextIndex = roundIndex + 1;
      setRoundIndex(nextIndex);
      setCurrentRound(session.rounds[nextIndex]);
      
      // Update URL without full page reload
      window.history.pushState({}, '', `/interview/round?roundIndex=${nextIndex}`);
    } else if (passed && roundIndex === session.rounds.length - 1) {
      // Interview completed
      router.push('/interview/results');
    } else {
      // Failed - end interview
      router.push('/interview/results?failed=true');
    }
  };

  const goBack = () => {
    router.push('/');
  };

  if (!session || !currentRound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Round {roundIndex + 1} {passed ? 'Completed!' : 'Failed'}
            </h2>

            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">
                <span className={passed ? 'text-green-600' : 'text-red-600'}>
                  {roundScore}%
                </span>
              </div>
              <p className="text-gray-600">
                Required: {currentRound.passCriteria}% | 
                Your Score: {roundScore}%
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">{currentRound.name}</h3>
              <p className="text-sm text-gray-600">{currentRound.focus}</p>
            </div>

            {passed ? (
              <div className="space-y-4">
                <p className="text-green-700">
                  Congratulations! You've passed this round.
                </p>
                {roundIndex < session.rounds.length - 1 ? (
                  <p className="text-gray-600">
                    Ready for the next round: <strong>{session.rounds[roundIndex + 1].name}</strong>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    You've completed all rounds! Let's see your final results.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-red-700">
                  Unfortunately, you didn't meet the pass criteria for this round.
                </p>
                <p className="text-gray-600">
                  Don't worry! Use this as a learning opportunity and try again.
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={goBack}
                className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
              <button
                onClick={proceedToNext}
                className={`px-6 py-2 rounded-lg font-medium ${
                  passed
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {passed && roundIndex < session.rounds.length - 1
                  ? 'Next Round'
                  : 'View Results'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Round {roundIndex + 1} of {session.rounds.length}
            </h1>
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Exit Interview
            </button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((roundIndex + 1) / session.rounds.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Round Component */}
        {currentRound.type === 'MCQ' && (
          <MCQRound
            roundName={currentRound.name}
            focus={currentRound.focus}
            questionCount={currentRound.questionCount || 10}
            onComplete={handleRoundComplete}
          />
        )}

        {currentRound.type === 'Voice' && (
          <VoiceRound
            roundName={currentRound.name}
            focus={currentRound.focus}
            onComplete={handleRoundComplete}
          />
        )}

        {currentRound.type === 'Coding' && (
          <CodingRound
            roundName={currentRound.name}
            focus={currentRound.focus}
            taskCount={currentRound.taskCount || 2}
            onComplete={handleRoundComplete}
          />
        )}
      </div>
    </div>
  );
}