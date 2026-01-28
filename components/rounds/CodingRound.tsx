'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Clock, CheckCircle } from 'lucide-react';

interface CodingRoundProps {
  roundName: string;
  focus: string;
  taskCount: number;
  onComplete: (score: number, solutions: any[]) => void;
}

const codingProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    starterCode: {
      javascript: "function twoSum(nums, target) {\n    // Your code here\n}",
      python: "def two_sum(nums, target):\n    # Your code here\n    pass",
      java: "public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}"
    }
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    example: "Input: s = \"()\"\nOutput: true\n\nInput: s = \"([)]\"\nOutput: false",
    starterCode: {
      javascript: "function isValid(s) {\n    // Your code here\n}",
      python: "def is_valid(s):\n    # Your code here\n    pass",
      java: "public boolean isValid(String s) {\n    // Your code here\n}"
    }
  }
];

export default function CodingRound({ roundName, focus, taskCount, onComplete }: CodingRoundProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [solutions, setSolutions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    const problem = codingProblems[currentTask];
    setCode(problem.starterCode[language as keyof typeof problem.starterCode]);
  }, [currentTask, language]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmitAll();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = () => {
    // Simulate code execution and testing
    const mockResults = {
      passed: Math.random() > 0.3,
      testCases: [
        { input: "Test case 1", expected: "Expected output", actual: "Actual output", passed: true },
        { input: "Test case 2", expected: "Expected output", actual: "Actual output", passed: false }
      ],
      executionTime: "45ms",
      memoryUsage: "12.3MB"
    };
    setTestResults(mockResults);
  };

  const submitSolution = () => {
    const solution = {
      problemId: codingProblems[currentTask].id,
      language,
      code,
      testResults,
      timeSpent: 1800 - timeLeft
    };

    const newSolutions = [...solutions, solution];
    setSolutions(newSolutions);

    if (currentTask < taskCount - 1) {
      setCurrentTask(currentTask + 1);
      setTestResults(null);
    } else {
      handleSubmitAll(newSolutions);
    }
  };

  const handleSubmitAll = (finalSolutions = solutions) => {
    // Calculate score based on solutions
    const totalScore = finalSolutions.reduce((sum, sol) => {
      return sum + (sol.testResults?.passed ? 100 : 50);
    }, 0);
    const avgScore = finalSolutions.length > 0 ? totalScore / finalSolutions.length : 0;
    
    onComplete(Math.round(avgScore), finalSolutions);
  };

  const problem = codingProblems[currentTask];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{roundName}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span className={timeLeft < 300 ? 'text-red-600 font-medium' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Problem {currentTask + 1} of {taskCount}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentTask + 1) / taskCount) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{problem.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Example</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700 overflow-x-auto">
                {problem.example}
              </pre>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mt-6 p-4 border rounded-lg">
              <div className="flex items-center mb-3">
                <CheckCircle className={`h-5 w-5 mr-2 ${testResults.passed ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`font-medium ${testResults.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.passed ? 'All Tests Passed' : 'Some Tests Failed'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {testResults.testCases.map((test: any, index: number) => (
                  <div key={index} className={`p-2 rounded ${test.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                    <span className={test.passed ? 'text-green-700' : 'text-red-700'}>
                      Test Case {index + 1}: {test.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                Execution Time: {testResults.executionTime} | Memory: {testResults.memoryUsage}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={runCode}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </button>

            <button
              onClick={submitSolution}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentTask === taskCount - 1 ? 'Submit All' : 'Next Problem'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}