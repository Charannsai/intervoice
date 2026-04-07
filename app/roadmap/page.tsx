'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  UploadCloud, File, X, Sparkles, CheckCircle2, XCircle,
  ArrowRight, BookOpen, Clock, RotateCcw, Activity
} from 'lucide-react';

export default function CareerRoadmap() {
  const [jd, setJd] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const encoded = result.split(',')[1] || result;
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!jd.trim()) {
      setError('Please paste a Job Description.');
      return;
    }
    if (!file) {
      setError('Please upload your Resume.');
      return;
    }

    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const base64Data = await fileToBase64(file);
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jd,
          fileData: base64Data,
          mimeType: file.type || 'application/pdf'
        })
      });

      if (!res.ok) throw new Error('Failed to generate roadmap');

      const data = await res.json();
      setRoadmap(data.roadmap);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while analyzing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">

        {/* Header — mirrors dashboard header style */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-200 dark:border-white/10 pb-8">
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-white tracking-tight mb-1 flex items-center gap-2">
              Career Roadmap
              <Sparkles className="h-5 w-5 text-zinc-400" />
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Upload your resume and paste a job description to get an actionable gap analysis.
            </p>
          </div>
          {roadmap && (
            <button
              onClick={() => { setRoadmap(null); setJd(''); setFile(null); }}
              className="bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-4 py-2 rounded-md transition-colors flex items-center gap-2 font-medium text-sm shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              New Analysis
            </button>
          )}
        </div>

        {!roadmap ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Job Description */}
            <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
                Job Description
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800 rounded-md p-4 text-sm text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-600 resize-none transition-colors"
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
                Resume
              </label>

              {!file ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-zinc-400 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800/50'
                      : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="h-8 w-8 text-zinc-400 mb-3" />
                  <p className="text-sm font-medium text-black dark:text-white mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-zinc-500">PDF, DOCX, or TXT — max 5MB</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900/30 border border-zinc-300 dark:border-zinc-800 rounded-md">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-zinc-500" />
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{file.name}</p>
                      <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
                  >
                    <X className="h-4 w-4 text-zinc-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0 text-zinc-500" />
                {error}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !jd || !file}
              className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 rounded-md font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Career Roadmap
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Match Score + Strengths / Gaps — mirrors stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Score Card */}
              <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Match Score</span>
                  <Activity className="h-4 w-4 text-zinc-600" />
                </div>
                <div className="text-3xl font-bold text-black dark:text-white tracking-tight mt-1">
                  {roadmap.matchPercentage}%
                </div>
              </div>

              {/* Strengths Card */}
              <div className="sm:col-span-2 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                    </h3>
                    <ul className="space-y-2">
                      {roadmap.strengths.map((str: string, i: number) => (
                        <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 dark:bg-zinc-400 mt-1.5 flex-shrink-0" />
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5" /> Skill Gaps
                    </h3>
                    <ul className="space-y-2">
                      {roadmap.weaknesses.map((weak: string, i: number) => (
                        <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 dark:bg-zinc-400 mt-1.5 flex-shrink-0" />
                          {weak}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white mb-6">Action Plan</h2>
              <div className="bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-300 dark:border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                {roadmap.roadmap.map((step: any, index: number) => (
                  <div key={index} className="p-5 hover:bg-zinc-200/40 dark:hover:bg-zinc-900/60 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Step index bubble */}
                      <div className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-black dark:text-white">{step.step}</h3>
                          <span className="text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />{step.timeframe}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                          {step.description}
                        </p>

                        {step.resources && step.resources.length > 0 && (
                          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md p-3">
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> Resources
                            </h4>
                            <ul className="space-y-1">
                              {step.resources.map((res: string, i: number) => (
                                <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                                  → {res}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed text-center">
                {roadmap.conclusion}
              </p>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
