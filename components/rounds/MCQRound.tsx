'use client';

import { useState, useEffect } from 'react';
import { Question, MCQResponse } from '@/types';

import { Clock, CheckCircle } from 'lucide-react';

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load questions. Please try again.</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{roundName}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span className={timeLeft < 60 ? 'text-red-600 font-medium' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Question {currentQuestion + 1}
          </h3>
          <p className="text-gray-700 leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-6 h-6 border-2 rounded-full mr-3 flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Select an answer to continue
          </div>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedAnswer
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}