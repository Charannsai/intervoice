'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Activity } from 'lucide-react';
import { geminiService } from '@/lib/gemini';
import { motion } from 'framer-motion';

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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Live Session</div>
          <h2 className="text-xl font-bold text-white">{roundName}</h2>
        </div>
        <div className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
          Q{questionCount + 1}/5
        </div>
      </div>

      {/* Main Interface */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-8 relative overflow-hidden">
        {/* Active Speaker Visualizer */}
        <div className="flex justify-center mb-12 relative h-32 items-center">
          {isSpeaking ? (
            <div className="flex gap-1 items-center justify-center h-full">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [20, 60, 20] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                  className="w-2 bg-white rounded-full"
                />
              ))}
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800/50">
              <Activity className="h-8 w-8 text-zinc-500" />
            </div>
          )}
        </div>

        {/* Question Area */}
        <div className="mb-8 text-center max-w-xl mx-auto">
          <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Interviewer</h3>
          <p className="text-xl text-white font-medium leading-relaxed">"{currentQuestion}"</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening
                ? 'bg-red-500/20 border border-red-500 text-red-500'
                : 'bg-white text-black hover:scale-105'
              } ${isSpeaking ? 'opacity-20 cursor-not-allowed' : ''}`}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
        </div>

        {/* Status Text */}
        <p className="text-center text-xs text-zinc-500 mb-8 font-mono">
          {isListening ? 'LISTENING...' : isSpeaking ? 'SPEAKING...' : 'READY TO RECORD'}
        </p>

        {/* Transcript */}
        <div className="bg-black/50 border border-zinc-800 rounded-lg p-4 min-h-[100px] mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-500 uppercase">Transcript</span>
            {transcript && <span className="text-xs text-emerald-500">Live</span>}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {transcript ? (
              <>
                <span className="text-white">{transcript.split('|INTERIM|')[0]}</span>
                <span className="text-zinc-600 ml-1">{transcript.split('|INTERIM|')[1]}</span>
              </>
            ) : (
              <span className="text-zinc-700 italic">Waiting for input...</span>
            )}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-6 border-t border-zinc-800">
          <button
            onClick={submitResponse}
            disabled={!transcript.trim() || isSpeaking}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${transcript.trim() && !isSpeaking
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
          >
            Submit Answer
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
          <h4 className="text-xs font-semibold text-white mb-2">Instructions</h4>
          <ul className="text-xs text-zinc-500 space-y-1">
            <li>• Speak clearly into your microphone</li>
            <li>• Keep answers concise (1-2 mins)</li>
            <li>• Wait for the AI to finish speaking</li>
          </ul>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
          <h4 className="text-xs font-semibold text-white mb-2">Tips</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Structure your response using the STAR method if applicable: Situation, Task, Action, Result.
          </p>
        </div>
      </div>
    </div>
  );
}