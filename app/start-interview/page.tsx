'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import { Upload, Briefcase, Clock, Target, FileText, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const jobRoles = [
  { id: 'frontend', title: 'Frontend Developer', category: 'Engineering' },
  { id: 'backend', title: 'Backend Developer', category: 'Engineering' },
  { id: 'fullstack', title: 'Full Stack Developer', category: 'Engineering' },
  { id: 'data-scientist', title: 'Data Scientist', category: 'Data' },
  { id: 'data-analyst', title: 'Data Analyst', category: 'Data' },
  { id: 'product-manager', title: 'Product Manager', category: 'Product' },
  { id: 'ui-ux', title: 'UI/UX Designer', category: 'Design' },
  { id: 'devops', title: 'DevOps Engineer', category: 'Engineering' },
];

const experienceLevels = [
  { id: 'fresher', title: 'Fresher', subtitle: '0-1 years' },
  { id: 'junior', title: 'Junior', subtitle: '1-3 years' },
  { id: 'mid', title: 'Mid-Level', subtitle: '3-5 years' },
  { id: 'senior', title: 'Senior', subtitle: '5+ years' },
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
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            New Simulation
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Configure your session parameters. Our AI will generate a tailored interview pipeline.
          </p>
        </div>

        <div className="space-y-12">
          {/* Role Selection */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs text-white">1</span>
              Target Role
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {jobRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${selectedRole === role.id
                    ? 'bg-white text-black border-white ring-2 ring-white/20'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    }`}
                >
                  <div className="font-medium text-sm mb-1">{role.title}</div>
                  <div className={`text-xs ${selectedRole === role.id ? 'text-zinc-500' : 'text-zinc-600'}`}>{role.category}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Experience Level */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs text-white">2</span>
              Experience Level
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${selectedLevel === level.id
                    ? 'bg-white text-black border-white ring-2 ring-white/20'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    }`}
                >
                  <div className="font-medium text-sm mb-1">{level.title}</div>
                  <div className={`text-xs ${selectedLevel === level.id ? 'text-zinc-500' : 'text-zinc-600'}`}>{level.subtitle}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Resume Upload */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs text-white">3</span>
                Context (Optional)
              </h2>
            </div>

            <div className={`border border-dashed rounded-lg p-8 text-center transition-all ${resume ? 'border-zinc-700 bg-zinc-900/30' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/10'
              }`}>
              <Upload className={`h-8 w-8 mx-auto mb-4 ${resume ? 'text-white' : 'text-zinc-600'}`} />
              <div className="mb-6">
                {resume ? (
                  <div>
                    <span className="text-white font-medium text-sm block mb-1">{resume.name}</span>
                    <span className="text-zinc-500 text-xs">{(resume.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-zinc-300 mb-1">Upload Resume (PDF)</p>
                    <p className="text-xs text-zinc-500">We'll parse your stack to tailor specific questions.</p>
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
                className={`px-4 py-2 rounded-md cursor-pointer font-medium text-sm transition-all inline-flex items-center gap-2 ${resume
                  ? 'text-zinc-400 hover:text-white'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
              >
                {resume ? 'Replace File' : 'Select File'}
              </label>
            </div>
          </section>

          {/* Start Button */}
          <div className="pt-8 border-t border-zinc-800/50">
            <button
              onClick={startInterview}
              disabled={!selectedRole || !selectedLevel}
              className={`w-full py-4 rounded-lg text-base font-medium transition-all flex items-center justify-center gap-2 ${selectedRole && selectedLevel
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800'
                }`}
            >
              Generate Protocol <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
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