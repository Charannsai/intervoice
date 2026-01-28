import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewRound, Question, JobRole } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  async generateInterviewRounds(role: string, experienceLevel: string): Promise<InterviewRound[]> {
    const prompt = `For the role of ${role} with ${experienceLevel} experience, generate a realistic company-style interview pipeline. Include 4-5 rounds with titles, purposes, evaluation focus, and types (MCQ, coding, voice interview, case, HR). Return in structured JSON format with fields: name, type, focus, questionCount (for MCQ), taskCount (for coding), passCriteria (percentage).`;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      return parsed.rounds.map((round: any, index: number) => ({
        id: `round-${index + 1}`,
        ...round
      }));
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return this.getDefaultRounds(role);
    }
  }

  async generateQuestions(roundType: string, focus: string, count: number): Promise<Question[]> {
    const prompt = `Generate ${count} ${roundType} questions focused on ${focus}. For MCQ questions, include 4 options and mark the correct answer. Return as JSON array with fields: question, options (for MCQ), correctAnswer, difficulty, category.`;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const questions = JSON.parse(cleanText);
      return questions.map((q: any, index: number) => ({
        id: `q-${Date.now()}-${index}`,
        type: roundType as 'MCQ' | 'Coding' | 'Voice',
        ...q
      }));
    } catch (error) {
      console.error('Failed to parse questions:', error);
      return [];
    }
  }

  async evaluateVoiceResponse(question: string, response: string, context: string): Promise<any> {
    const prompt = `Evaluate this interview response:
    Question: ${question}
    Response: ${response}
    Context: ${context}
    
    Rate on scale 1-10 for: technical accuracy, communication clarity, confidence.
    Provide brief feedback and next question suggestion.
    Return as JSON with fields: technical, communication, confidence, feedback, nextQuestion.`;
    
    const result = await this.model.generateContent(prompt);
    const response_text = await result.response.text();
    
    try {
      const cleanText = response_text.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      return {
        technical: 7,
        communication: 7,
        confidence: 7,
        feedback: "Good response, continue with next question.",
        nextQuestion: "Tell me about your experience with this technology."
      };
    }
  }

  private getDefaultRounds(role: string): InterviewRound[] {
    return [
      {
        id: 'round-1',
        name: 'Aptitude & Logical Round',
        type: 'MCQ',
        focus: 'Analytical reasoning, problem solving',
        questionCount: 10,
        passCriteria: 60
      },
      {
        id: 'round-2',
        name: 'Technical Fundamentals',
        type: 'MCQ',
        focus: `${role} core concepts`,
        questionCount: 15,
        passCriteria: 70
      },
      {
        id: 'round-3',
        name: 'Practical Challenge',
        type: 'Coding',
        focus: 'Problem solving and implementation',
        taskCount: 2,
        passCriteria: 60
      },
      {
        id: 'round-4',
        name: 'Technical Interview',
        type: 'Voice',
        focus: 'Resume-based technical discussion',
        passCriteria: 70
      },
      {
        id: 'round-5',
        name: 'HR Round',
        type: 'Voice',
        focus: 'Behavioral and cultural fit',
        passCriteria: 60
      }
    ];
  }
}

export const geminiService = new GeminiService();