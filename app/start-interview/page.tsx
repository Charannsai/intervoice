'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import { Upload, Briefcase, Clock, Target, FileText, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const jobRoles = [
  { id: 'frontend', title: 'Frontend Developer', category: 'Engineering', icon: '💻' },
  { id: 'backend', title: 'Backend Developer', category: 'Engineering', icon: '⚙️' },
  { id: 'fullstack', title: 'Full Stack Developer', category: 'Engineering', icon: '🔧' },
  { id: 'data-scientist', title: 'Data Scientist', category: 'Data', icon: '📊' },
  { id: 'data-analyst', title: 'Data Analyst', category: 'Data', icon: '📈' },
  { id: 'product-manager', title: 'Product Manager', category: 'Product', icon: '🎯' },
  { id: 'ui-ux', title: 'UI/UX Designer', category: 'Design', icon: '🎨' },
  { id: 'devops', title: 'DevOps Engineer', category: 'Engineering', icon: '☁️' },
];

const experienceLevels = [
  { id: 'fresher', title: 'Fresher', subtitle: '0-1 years', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { id: 'junior', title: 'Junior', subtitle: '1-3 years', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { id: 'mid', title: 'Mid-Level', subtitle: '3-5 years', color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
  { id: 'senior', title: 'Senior', subtitle: '5+ years', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
];

function StartInterview() {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      setResume(file);
    }
  };

  const startInterview = () => {
    if (selectedRole && selectedLevel) {
      const params = new URLSearchParams({
        role: selectedRole,
        level: selectedLevel,
        resume: resume?.name || ''
      });
      router.push(`/interview/setup?${params}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Configure Your Simulation
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Customize your interview experience by selecting your target role, experience level, and uploading your resume.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 md:p-10 border border-slate-800/50 shadow-2xl bg-slate-900/40 backdrop-blur-xl"
        >
          {/* Role Selection */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg mr-3">
                <Target className="h-6 w-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Target Role</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {jobRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 border rounded-xl text-left transition-all duration-200 group relative overflow-hidden ${selectedRole === role.id
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                >
                  <div className="text-2xl mb-3">{role.icon}</div>
                  <div className={`font-semibold mb-1 transition-colors ${selectedRole === role.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{role.title}</div>
                  <div className="text-xs text-slate-500">{role.category}</div>
                  {selectedRole === role.id && (
                    <div className="absolute top-3 right-3 text-indigo-400">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-violet-500/10 rounded-lg mr-3">
                <Clock className="h-6 w-6 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Experience Level</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${selectedLevel === level.id
                      ? `${level.color} shadow-lg`
                      : 'border-slate-800 bg-slate-800/30 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                >
                  <div className="font-bold text-lg mb-1">{level.title}</div>
                  <div className="text-sm opacity-80">{level.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Upload Resume</h2>
              <span className="ml-3 text-xs uppercase tracking-wider text-slate-500 font-semibold bg-slate-800 px-2 py-1 rounded">Optional</span>
            </div>

            <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${resume ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/30'
              }`}>
              <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${resume ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div className="mb-6">
                {resume ? (
                  <div>
                    <span className="text-emerald-400 font-medium text-lg block mb-1">{resume.name}</span>
                    <span className="text-slate-500 text-sm">{(resume.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-slate-300 mb-2">Drop your resume here or click to browse</p>
                    <p className="text-sm text-slate-500">Supports PDF, DOC, DOCX files used for tailoring questions</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className={`px-6 py-3 rounded-xl cursor-pointer font-medium transition-all inline-flex items-center gap-2 ${resume
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                  }`}
              >
                {resume ? 'Change File' : 'Select File'}
              </label>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-8 border-t border-slate-800/50 flex flex-col items-center">
            <button
              onClick={startInterview}
              disabled={!selectedRole || !selectedLevel}
              className={`w-full md:w-auto px-12 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3 ${selectedRole && selectedLevel
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
            >
              Generate Interview Pipeline <ArrowRight className="h-5 w-5" />
            </button>
            {(!selectedRole || !selectedLevel) && (
              <p className="text-sm text-slate-500 mt-4 animate-pulse">
                Select a target role and experience level to proceed
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProtectedStartInterview() {
  return (
    <AuthGuard>
      <StartInterview />
    </AuthGuard>
  );
}