export interface User {
  id: string;
  email: string;
  name: string;
  resume?: string;
}

export interface InterviewRound {
  id: string;
  name: string;
  type: 'MCQ' | 'Coding' | 'Voice' | 'Case' | 'Design';
  focus: string;
  questionCount?: number;
  taskCount?: number;
  duration?: number;
  passCriteria: number;
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  experienceLevel: string;
  rounds: InterviewRound[];
  currentRound: number;
  scores: Record<string, number>;
  status: 'active' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'MCQ' | 'Coding' | 'Voice';
  question: string;
  options?: string[];
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface MCQResponse {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface VoiceResponse {
  transcript: string;
  confidence: number;
  evaluation: {
    technical: number;
    communication: number;
    clarity: number;
  };
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  rounds: Omit<InterviewRound, 'id'>[];
}