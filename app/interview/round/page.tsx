'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InterviewSession, InterviewRound } from '@/types';
import MCQRound from '@/components/rounds/MCQRound';
import VoiceRound from '@/components/rounds/VoiceRound';
import CodingRound from '@/components/rounds/CodingRound';
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function RoundPageContent() {
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
      setShowResult(false);
      setRoundScore(0);
      setPassed(false);
      const nextIndex = roundIndex + 1;
      setRoundIndex(nextIndex);
      setCurrentRound(session.rounds[nextIndex]);
      window.history.pushState({}, '', `/interview/round?roundIndex=${nextIndex}`);
    } else if (passed && roundIndex === session.rounds.length - 1) {
      router.push('/interview/results');
    } else {
      router.push('/interview/results?failed=true');
    }
  };

  const goBack = () => {
    router.push('/');
  };

  if (!session || !currentRound) {
    return <LoadingSpinner fullScreen text="Loading session..." />;
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-8 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? 'bg-emerald-500/10' : 'bg-red-500/10'
            }`}>
            {passed ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
          </div>

          <h2 className="text-xl font-bold text-black dark:text-white mb-2">
            Round {roundIndex + 1} {passed ? 'Complete' : 'Incomplete'}
          </h2>

          <div className="mb-6 flex flex-col items-center">
            <span className={`text-4xl font-bold mb-2 ${passed ? 'text-black dark:text-white' : 'text-red-400'}`}>
              {roundScore}%
            </span>
            <p className="text-zinc-500 text-sm">
              Required: {currentRound.passCriteria}%
            </p>
          </div>

          <div className="bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-sm font-medium text-white">{currentRound.name}</h3>
            <p className="text-xs text-zinc-500 mt-1">{currentRound.focus}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={proceedToNext}
              className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${passed
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-700'
                }`}
            >
              {passed && roundIndex < session.rounds.length - 1
                ? <>Next Module <ArrowRight className="h-4 w-4" /></>
                : 'View Final Report'
              }
            </button>
            <button
              onClick={goBack}
              className="text-zinc-500 hover:text-black dark:text-white text-sm"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Round {roundIndex + 1}/{session.rounds.length}</span>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
            <span className="text-sm font-medium text-white">{currentRound.name}</span>
          </div>

          <button
            onClick={goBack}
            className="text-zinc-500 hover:text-black dark:text-white text-sm flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Abort</span>
          </button>
        </div>
        {/* Progress Line */}
        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${((roundIndex + 1) / session.rounds.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex-grow w-full">
        {/* Round Component Wrapper */}
        <div className="animate-fade-in">
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
    </div>
  );
}

export default function RoundPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <RoundPageContent />
    </Suspense>
  );
}