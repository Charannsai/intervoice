'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { geminiService } from '@/lib/gemini';

interface VoiceRoundProps {
  roundName: string;
  focus: string;
  onComplete: (score: number, evaluation: any) => void;
}

export default function VoiceRound({ roundName, focus, onComplete }: VoiceRoundProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    initializeSpeechAPIs();
    startInterview();
  }, []);

  const initializeSpeechAPIs = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscript(prev => {
            const existingFinal = prev.split('|INTERIM|')[0] || '';
            return existingFinal + finalTranscript + (interimTranscript ? '|INTERIM|' + interimTranscript : '');
          });
        };

        recognitionRef.current.onerror = () => setIsListening(false);
      }

      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }
  };

  const startInterview = async () => {
    const initialQuestion = `Hello! Welcome to the ${roundName}. I'll be asking you questions about ${focus}. Let's start with: Tell me about yourself and your experience in this field.`;
    setCurrentQuestion(initialQuestion);
    speakText(initialQuestion);
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const submitResponse = async () => {
    const finalTranscript = transcript.split('|INTERIM|')[0] || transcript;
    if (finalTranscript.trim()) {
      try {
        const evaluation = await geminiService.evaluateVoiceResponse(
          currentQuestion,
          finalTranscript,
          focus
        );

        const response = {
          question: currentQuestion,
          answer: finalTranscript,
          evaluation
        };

        const newResponses = [...responses, response];
        setResponses(newResponses);
        setQuestionCount(questionCount + 1);

        if (questionCount < 4) { // 5 questions total
          setCurrentQuestion(evaluation.nextQuestion || 'Tell me more about your experience.');
          speakText(evaluation.nextQuestion || 'Tell me more about your experience.');
          setTranscript('');
        } else {
          // Calculate final score
          const avgScore = newResponses.reduce((sum, r) => 
            sum + (r.evaluation.technical + r.evaluation.communication + r.evaluation.confidence) / 3, 0
          ) / newResponses.length;
          
          onComplete(Math.round(avgScore * 10), { responses: newResponses, avgScore });
        }
      } catch (error) {
        console.error('Error evaluating response:', error);
      }
    }
  };

  const toggleMute = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{roundName}</h2>
          <div className="text-sm text-gray-500">
            Question {questionCount + 1} of 5
          </div>
        </div>
        <p className="text-gray-600 mt-2">Focus: {focus}</p>
      </div>

      {/* Interview Interface */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        {/* AI Avatar */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl text-white">🤖</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">AI Interviewer</h3>
        </div>

        {/* Current Question */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-medium text-gray-900">Current Question:</h4>
            <button
              onClick={toggleMute}
              className="text-gray-500 hover:text-gray-700"
            >
              {isSpeaking ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed">{currentQuestion}</p>
          {isSpeaking && (
            <div className="mt-4 flex items-center text-blue-600">
              <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm">AI is speaking...</span>
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="text-center mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600'
            } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            {isListening ? 'Click to stop recording' : 'Click to start recording'}
          </p>
        </div>

        {/* Live Transcript */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 min-h-[100px]">
          <h4 className="font-medium text-blue-900 mb-2">Live Transcript:</h4>
          {transcript ? (
            <div className="text-blue-800">
              <span>{transcript.split('|INTERIM|')[0]}</span>
              {transcript.includes('|INTERIM|') && (
                <span className="text-blue-600 opacity-70 italic">
                  {transcript.split('|INTERIM|')[1]}
                </span>
              )}
            </div>
          ) : (
            <p className="text-blue-600 opacity-50 italic">
              {isListening ? 'Listening... Start speaking' : 'Click the microphone to start recording'}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={submitResponse}
            disabled={!transcript.trim() || isSpeaking}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              transcript.trim() && !isSpeaking
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Response
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Listen to the question carefully</li>
            <li>• Click the microphone to start recording your answer</li>
            <li>• Speak clearly and at a normal pace</li>
            <li>• Click again to stop recording</li>
            <li>• Review your transcript and submit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}