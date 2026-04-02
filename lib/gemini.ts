import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewRound, Question, JobRole } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateInterviewRounds(role: string, experienceLevel: string): Promise<InterviewRound[]> {
    const prompt = `For the role of ${role} with ${experienceLevel} experience, generate a realistic company-style interview pipeline. Include 4-5 rounds with titles, purposes, evaluation focus, and types (MCQ, coding, voice interview, case, HR). Return a JSON object with a key "rounds" containing an array of objects with fields: name, type (MCQ, Coding, Voice, Case), focus, questionCount (number, for MCQ), taskCount (number, for coding), passCriteria (number).`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);

      const roundsArray = Array.isArray(parsed) ? parsed : (parsed.rounds || []);

      if (!Array.isArray(roundsArray) || roundsArray.length === 0) {
        throw new Error('Invalid rounds format received');
      }

      return roundsArray.map((round: any, index: number) => ({
        id: `round-${index + 1}`,
        type: round.type || 'Voice', // Fallback type
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
      const parsed = JSON.parse(cleanText);

      // Handle both array and object { questions: [...] } formats
      const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || []);

      if (!Array.isArray(questionsArray)) {
        throw new Error('Invalid questions format');
      }

      return questionsArray.map((q: any, index: number) => ({
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

  async recommendCourses(role: string, context: string): Promise<any[]> {
    const prompt = `Based on a user interviewing for ${role} who needs to improve on: "${context}", recommend exactly 2 free, high-quality online courses or resources (like freeCodeCamp, YouTube playlists, or official documentation) they should study.
    Return ONLY a JSON array with objects containing fields: "title" (string), "provider" (string), "description" (short 1-sentence string), "url" (a realistic URL like https://www.youtube.com/results?search_query=...). Make sure URLs are valid formats.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      return Array.isArray(parsed) ? parsed : (parsed.courses || []);
    } catch (error) {
      console.error('Failed to parse recommendations:', error);
      return [
        {
          title: 'System Design Interview Crash Course',
          provider: 'YouTube',
          description: 'A comprehensive crash course on system design fundamentals.',
          url: 'https://www.youtube.com/results?search_query=system+design+interview+crash+course'
        },
        {
          title: 'Data Structures and Algorithms',
          provider: 'freeCodeCamp',
          description: 'Full course on data structures and algorithms in JavaScript.',
          url: 'https://www.youtube.com/watch?v=8hly31xKli0'
        }
      ];
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