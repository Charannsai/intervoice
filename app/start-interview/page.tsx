'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import { Upload, ArrowRight, ArrowLeft } from 'lucide-react';

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
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const handleBackToDashboard = () => {
    const hasChanges = selectedRole || selectedLevel || resume;
    if (hasChanges) {
      setShowConfirmModal(true);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-6 text-black dark:text-white flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-10">
            <button 
              onClick={handleBackToDashboard}
              className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:text-white hover:bg-zinc-100 dark:bg-zinc-900 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2 tracking-tight">
              New Simulation
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Step {step} of 3
            </p>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-300 dark:border-zinc-800 rounded-xl p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800">
              <div 
                className="h-full bg-white transition-all duration-300" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="pt-4 flex-grow">
              {step === 1 && (
                <section className="animate-fade-in">
                  <h2 className="text-xl font-medium text-black dark:text-white mb-6">Select your target role</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {jobRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 border rounded-lg text-left transition-all ${selectedRole === role.id
                          ? 'bg-white text-black border-white ring-2 ring-white/20'
                          : 'bg-white dark:bg-black border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-600 hover:text-black dark:text-white'
                          }`}
                      >
                        <div className="font-medium text-sm mb-1">{role.title}</div>
                        <div className={`text-xs ${selectedRole === role.id ? 'text-zinc-500' : 'text-zinc-600'}`}>{role.category}</div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="animate-fade-in">
                  <h2 className="text-xl font-medium text-black dark:text-white mb-6">What is your experience level?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`p-4 border rounded-lg text-left transition-all flex justify-between items-center ${selectedLevel === level.id
                          ? 'bg-white text-black border-white ring-2 ring-white/20'
                          : 'bg-white dark:bg-black border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-600 hover:text-black dark:text-white'
                          }`}
                      >
                        <div>
                          <div className="font-medium text-sm mb-1">{level.title}</div>
                          <div className={`text-xs ${selectedLevel === level.id ? 'text-zinc-500' : 'text-zinc-600'}`}>{level.subtitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="animate-fade-in">
                  <h2 className="text-xl font-medium text-black dark:text-white mb-6">Upload your resume for context</h2>
                  <div className={`border border-dashed rounded-lg p-12 text-center transition-all ${resume ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900/30' : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900/10'}`}>
                    <Upload className={`h-8 w-8 mx-auto mb-4 ${resume ? 'text-black dark:text-white' : 'text-zinc-600'}`} />
                    <div className="mb-6">
                      {resume ? (
                        <div>
                          <span className="text-black dark:text-white font-medium text-sm block mb-1">{resume.name}</span>
                          <span className="text-zinc-500 text-xs">{(resume.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Upload Resume (PDF, DOCX)</p>
                          <p className="text-xs text-zinc-500 mt-2 max-w-xs mx-auto">Providing your resume allows our AI to tailor the mock interview exactly to your stack and experience.</p>
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
                        ? 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-700'
                        }`}
                    >
                      {resume ? 'Replace File' : 'Select File'}
                    </label>
                  </div>
                </section>
              )}
            </div>

            {/* Navigation Buttons for Wizard */}
            <div className="pt-6 mt-6 flex items-center justify-between border-t border-zinc-300 dark:border-zinc-800/50">
              <button
                onClick={() => setStep(step - 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step === 1 ? 'invisible' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:text-white hover:bg-zinc-200 dark:bg-zinc-800'}`}
              >
                Previous Step
              </button>
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={(step === 1 && !selectedRole) || (step === 2 && !selectedLevel)}
                  className={`px-6 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-all ${
                    ((step === 1 && selectedRole) || (step === 2 && selectedLevel))
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={startInterview}
                  disabled={!selectedRole || !selectedLevel}
                  className={`px-6 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRole && selectedLevel
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Assemble Protocol <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Discard Session?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
              You have unsaved configuration changes. Are you sure you want to return to the dashboard and discard them?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:text-white hover:bg-zinc-200 dark:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                Discard & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProtectedStartInterview() {
  return (
    <AuthGuard>
      <StartInterview />
    </AuthGuard>
  );
}