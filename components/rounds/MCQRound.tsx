'use client';

import { useState, useEffect } from 'react';
import { Question, MCQResponse } from '@/types';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MCQRoundProps {
  roundName: string;
  focus: string;
  questionCount: number;
  onComplete: (score: number, responses: MCQResponse[]) => void;
}

export default function MCQRound({ roundName, focus, questionCount, onComplete }: MCQRoundProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [responses, setResponses] = useState<MCQResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, loading]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundType: 'MCQ', focus, count: questionCount })
      });
      const data = await response.json();
      setQuestions(data.questions);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const timeSpent = Date.now() - startTime;
      const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

      const response: MCQResponse = {
        questionId: questions[currentQuestion].id,
        selectedAnswer,
        isCorrect,
        timeSpent
      };

      const newResponses = [...responses, response];
      setResponses(newResponses);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setStartTime(Date.now());
      } else {
        handleSubmit(newResponses);
      }
    }
  };

  const handleSubmit = (finalResponses = responses) => {
    const correctAnswers = finalResponses.filter(r => r.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    onComplete(score, finalResponses);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading module..." />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 text-sm">Error initializing module. Please retry.</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Module Processing</div>
          <h2 className="text-xl font-bold text-white">{roundName}</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-mono text-sm mb-1">
            <Clock className="h-4 w-4" />
            <span className={timeLeft < 60 ? 'text-red-500' : ''}>{formatTime(timeLeft)}</span>
          </div>
          <div className="text-xs text-zinc-600">Question {currentQuestion + 1} / {questions.length}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-1 mb-8">
        <div
          className="bg-white h-1 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-300 dark:border-zinc-800 rounded-lg p-8">
        <div className="mb-8">
          <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 border rounded-lg transition-all flex items-center gap-4 group ${selectedAnswer === option
                  ? 'border-white bg-white/5 text-black dark:text-white'
                  : 'border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900/50'
                }`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono transition-colors ${selectedAnswer === option ? 'border-emerald-500 text-emerald-500' : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 group-hover:border-zinc-500'
                }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-zinc-300 dark:border-zinc-800/50">
          <span className="text-xs text-zinc-600">
            Selection required to proceed
          </span>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${selectedAnswer
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
          >
            {currentQuestion === questions.length - 1 ? 'Complete Module' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}