'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Clock, CheckCircle2, AlertTriangle, Code2 } from 'lucide-react';

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
    const totalScore = finalSolutions.reduce((sum, sol) => {
      return sum + (sol.testResults?.passed ? 100 : 50);
    }, 0);
    const avgScore = finalSolutions.length > 0 ? totalScore / finalSolutions.length : 0;

    onComplete(Math.round(avgScore), finalSolutions);
  };

  const problem = codingProblems[currentTask];

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Live Assessment</h2>
            <div className="text-xs text-zinc-500">Task {currentTask + 1} of {taskCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-zinc-400 font-mono text-sm border border-zinc-800 px-3 py-1 bg-zinc-900 rounded flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={submitSolution}
            className="bg-white text-black px-4 py-1.5 rounded text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            {currentTask === taskCount - 1 ? 'Final Submission' : 'Next Task'}
          </button>
        </div>
      </div>

      <div className="flex-grow grid lg:grid-cols-2 gap-4 h-full overflow-hidden">
        {/* Left Panel: Problem & Output */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          {/* Problem */}
          <div className="flex-grow bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                }`}>
                {problem.difficulty}
              </span>
            </div>

            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-zinc-300 mb-6">{problem.description}</p>

              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Example</h4>
              <div className="bg-black/50 border border-zinc-800 p-4 rounded-md font-mono text-xs text-zinc-300 whitespace-pre-wrap">
                {problem.example}
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="h-1/3 bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-transparent">
              <h4 className="text-zinc-400 text-xs font-semibold uppercase">Console Output</h4>
              {testResults && (
                <span className={`text-xs flex items-center gap-1.5 ${testResults.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                  {testResults.passed ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {testResults.passed ? 'All Tests Passed' : 'Tests Failed'}
                </span>
              )}
            </div>

            {testResults ? (
              <div className="space-y-2">
                {testResults.testCases.map((test: any, index: number) => (
                  <div key={index} className={`p-2 rounded text-xs font-mono flex justify-between ${test.passed ? 'bg-emerald-500/5 text-emerald-400' : 'bg-red-500/5 text-red-400'}`}>
                    <span>Test Case {index + 1}</span>
                    <span>{test.passed ? 'PASS' : 'FAIL'}</span>
                  </div>
                ))}
                <div className="border-t border-zinc-800 mt-2 pt-2 text-[10px] text-zinc-600 font-mono">
                  Exec: {testResults.executionTime} • Mem: {testResults.memoryUsage}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
                Run code to see output...
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
          <div className="h-10 border-b border-zinc-800 bg-black/50 flex items-center justify-between px-4">
            <span className="text-xs text-zinc-500 font-mono">editor.tsx</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs text-zinc-300 outline-none cursor-pointer hover:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="flex-grow relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 }
              }}
            />
          </div>

          <div className="p-4 border-t border-zinc-800 bg-black/20 flex justify-end">
            <button
              onClick={runCode}
              className="flex items-center text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded transition-colors"
            >
              <Play className="h-3 w-3 mr-2" />
              Run & Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}