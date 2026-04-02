import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewRound, Question, JobRole } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);

      // Handle both array and object { questions: [...] } formats
      const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || []);

      if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        throw new Error('Invalid questions format');
      }

      return questionsArray.map((q: any, index: number) => ({
        id: `q-${Date.now()}-${index}`,
        type: roundType as 'MCQ' | 'Coding' | 'Voice',
        ...q
      }));
    } catch (error) {
      console.error('Failed to generate questions, using fallback:', error);
      return this.getDefaultQuestions(roundType, focus, count);
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

    try {
      const result = await this.model.generateContent(prompt);
      const response_text = await result.response.text();

      const cleanText = response_text.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      return {
        technical: 7,
        communication: 7,
        confidence: 7,
        feedback: "Good response, continue with next question. (Fallback Evaluation)",
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
        questionCount: 5,
        passCriteria: 60
      },
      {
        id: 'round-2',
        name: 'Technical Fundamentals',
        type: 'MCQ',
        focus: `${role} core concepts`,
        questionCount: 5,
        passCriteria: 70
      },
      {
        id: 'round-3',
        name: 'Practical Challenge',
        type: 'Coding',
        focus: 'Problem solving and implementation',
        taskCount: 1,
        passCriteria: 60
      },
      {
        id: 'round-4',
        name: 'Technical Interview',
        type: 'Voice',
        focus: 'Resume-based technical discussion',
        passCriteria: 70
      }
    ];
  }

  private getDefaultQuestions(roundType: string, focus: string, count: number): Question[] {
    const questions: Question[] = [];
    const f = focus.toLowerCase();

    // Determine domain from focus
    let domain = 'general';
    if (f.includes('frontend') || f.includes('react') || f.includes('angular') || f.includes('vue') || f.includes('ui')) domain = 'frontend';
    else if (f.includes('backend') || f.includes('node') || f.includes('java') || f.includes('python') || f.includes('api')) domain = 'backend';
    else if (f.includes('data') || f.includes('sql') || f.includes('machine learning') || f.includes('analytics')) domain = 'data';
    else if (f.includes('devops') || f.includes('cloud') || f.includes('aws') || f.includes('docker')) domain = 'devops';

    // Domain specific dictionaries
    const mcqPool: Record<string, any[]> = {
      frontend: [
        { q: "What is the primary difference between state and props in React?", options: ["State is mutable and managed internally, props are immutable and passed from parents", "State is immutable, props are mutable", "They are exactly the same concept", "Props are used for styling only"], a: "State is mutable and managed internally, props are immutable and passed from parents" },
        { q: "Which CSS property is used to create a flexbox container?", options: ["display: flex", "flex-container: true", "layout: flexbox", "position: flex"], a: "display: flex" },
        { q: "What is the virtual DOM?", options: ["A lightweight JavaScript representation of the actual DOM", "A physical server-side rendering DOM", "A completely different language for UI", "A deprecated feature in modern browsers"], a: "A lightweight JavaScript representation of the actual DOM" },
        { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], a: "Cascading Style Sheets" },
        { q: "What is closure in JavaScript?", options: ["A function bundled together with its lexical environment", "A way to close a browser window", "A method to compress HTML", "A syntax error"], a: "A function bundled together with its lexical environment" }
      ],
      backend: [
        { q: "What is the purpose of an index in a database?", options: ["To speed up data retrieval operations", "To encrypt the database", "To validate data types", "To format output text"], a: "To speed up data retrieval operations" },
        { q: "Which HTTP method is idempotent?", options: ["PUT", "POST", "PATCH", "CONNECT"], a: "PUT" },
        { q: "What does REST stand for?", options: ["Representational State Transfer", "Remote Execution System Transfer", "Real-time Event Streaming Transfer", "Random Exact State Text"], a: "Representational State Transfer" },
        { q: "In Node.js, what executes asynchronous callbacks?", options: ["Event Loop", "V8 Engine", "Garbage Collector", "Compiler"], a: "Event Loop" },
        { q: "What is database normalization?", options: ["Organizing data to reduce redundancy", "Converting all text to lowercase", "A backup strategy", "Increasing redundant structures for speed"], a: "Organizing data to reduce redundancy" }
      ],
      data: [
        { q: "Which SQL clause is used to filter rows after aggregation?", options: ["HAVING", "WHERE", "FILTER", "GROUP BY"], a: "HAVING" },
        { q: "What is supervised learning?", options: ["Training a model on labeled data", "Training a model without labels", "Reinforcement through rewards", "A method of database scaling"], a: "Training a model on labeled data" },
        { q: "What does ETL stand for?", options: ["Extract, Transform, Load", "Execute, Transfer, Listen", "Event, Trigger, Log", "Entry, Text, Language"], a: "Extract, Transform, Load" },
        { q: "Which metric is best for imbalanced classification?", options: ["F1-Score", "Accuracy", "Mean Squared Error", "R-squared"], a: "F1-Score" },
        { q: "What is a primary key?", options: ["A unique identifier for a table record", "The first column in a table", "A password to access the database", "A foreign key linked to another table"], a: "A unique identifier for a table record" }
      ],
      devops: [
        { q: "What is Docker primarily used for?", options: ["Containerization", "Virtual Machine emulation", "Database hosting", "Frontend rendering"], a: "Containerization" },
        { q: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Delivery", "Cloud Infrastructure / Cloud Deployment", "Centralized Information / Central Database"], a: "Continuous Integration / Continuous Deployment" },
        { q: "Which is an infrastructure as code (IaC) tool?", options: ["Terraform", "React", "PostgreSQL", "Nginx"], a: "Terraform" },
        { q: "What is Kubernetes?", options: ["A container orchestration system", "A programming language", "A relational database", "A CSS framework"], a: "A container orchestration system" },
        { q: "What is a reverse proxy?", options: ["A server that sits in front of web servers and forwards requests", "A proxy used to hide user IP addresses", "A firewall testing tool", "A database load balancer"], a: "A server that sits in front of web servers and forwards requests" }
      ],
      general: [
        { q: "What is Big O notation used for?", options: ["Describing the performance or complexity of an algorithm", "Styling websites", "Version control", "Database security"], a: "Describing the performance or complexity of an algorithm" },
        { q: "What does SOLID stand for in object-oriented design?", options: ["Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion", "Simple, Organized, Logical, Integrated, Defined", "Software Object Lifecycle In Development", "System Operations Logic In Deployment"], a: "Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion" },
        { q: "What is the time complexity of binary search?", options: ["O(log n)", "O(n)", "O(n^2)", "O(1)"], a: "O(log n)" },
        { q: "Which data structure operates on a Last In First Out (LIFO) principle?", options: ["Stack", "Queue", "Linked List", "Tree"], a: "Stack" },
        { q: "What is a common use for a Hash Table?", options: ["Fast data retrieval via key-value pairs", "Sorting numerical arrays", "Creating hierarchical trees", "Managing CPU thread states"], a: "Fast data retrieval via key-value pairs" }
      ]
    };

    const taskPool: Record<string, string[]> = {
      frontend: [
        "Implement a custom React hook `useDebounce` that delays updating a value until a specified time has passed.",
        "Create a responsive navigation bar using HTML/CSS and JavaScript with a mobile hamburger menu toggle.",
        "Write a function that fetches paginated data from a mock API and implements infinite scrolling logic."
      ],
      backend: [
        "Design a REST API endpoint structure in Node.js/Express for a task management app with complete CRUD operations.",
        "Write a SQL query that finds the second highest salary from an Employee table without using the LIMIT keyword.",
        "Implement a basic rate limiter middleware using a token bucket algorithm to restrict API requests."
      ],
      data: [
        "Write a python script using Pandas to read a large CSV, handle missing values, and group the data by categorical columns.",
        "Write a complex SQL query utilizing window functions to calculate the 7-day rolling average of daily sales.",
        "Implement a random split algorithm from scratch that divides an array into training and testing sets without external libraries."
      ],
      devops: [
        "Write a standard Dockerfile for a Node.js application, incorporating multi-stage builds to optimize image size.",
        "Outline a GitHub Actions YAML workflow that runs a linter, executes unit tests, and builds a docker image on every push to the main branch.",
        "Create a bash script that pings an endpoint every 5 minutes and logs the response time to a text file with a timestamp."
      ],
      general: [
        "Write a function that determines if a given string is a valid palindrome, ignoring spaces and special characters.",
        "Implement a function that reverses a linked list in-place.",
        "Write an algorithm to find the longest substring without repeating characters."
      ]
    };

    const voicePool: Record<string, string[]> = {
      frontend: [
        "Walk me through how you optimize a slow-loading web application.",
        "Explain the concept of accessibility in web development and how you ensure your interfaces meet WCAG guidelines.",
        "Describe a time you had to deal with complex state management in a large frontend application."
      ],
      backend: [
        "How do you ensure a scalable backend architecture when anticipating rapid user growth?",
        "Explain how you would handle asynchronous messaging arrays between microservices.",
        "Tell me about a challenging database migration or optimization task you've led."
      ],
      data: [
        "Explain the trade-offs between precision and recall, and tell me about a time you had to prioritize one over the other.",
        "Walk me through your data cleaning and preprocessing workflow.",
        "Describe a complex data pipeline you've built and the architecture behind it."
      ],
      devops: [
        "Walk me through your approach to setting up monitoring and alerting for a critical production system.",
        "Explain how you handle zero-downtime deployments.",
        "Describe a major production incident you managed and how you formulated the post-mortem."
      ],
      general: [
        "Can you describe a time when you disagreed with a technical decision made by your team?",
        "Walk me through the most challenging technical complex problem you’ve solved recently.",
        "How do you approach learning a completely new programming language or framework under pressure?"
      ]
    };

    for (let i = 0; i < count; i++) {
      if (roundType === 'MCQ') {
        const pool = mcqPool[domain];
        const selected = pool[i % pool.length];
        questions.push({
          id: `fallback-q-${Date.now()}-${i}`,
          type: 'MCQ',
          question: selected.q,
          options: selected.options,
          correctAnswer: selected.a,
          difficulty: 'medium',
          category: focus
        });
      } else if (roundType === 'Coding') {
        const pool = taskPool[domain];
        const selected = pool[i % pool.length];
        questions.push({
          id: `fallback-q-${Date.now()}-${i}`,
          type: 'Coding',
          question: selected,
          difficulty: 'medium',
          category: focus
        });
      } else {
        const pool = voicePool[domain];
        const selected = pool[i % pool.length];
        questions.push({
          id: `fallback-q-${Date.now()}-${i}`,
          type: 'Voice',
          question: selected,
          difficulty: 'medium',
          category: focus
        });
      }
    }
    
    return questions;
  }
}

export const geminiService = new GeminiService();