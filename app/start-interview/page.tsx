'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/ui/AuthGuard';
import { Upload, Briefcase, Clock, Target } from 'lucide-react';

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
  { id: 'fresher', title: 'Fresher', subtitle: '0-1 years', color: 'bg-green-50 border-green-200 text-green-800' },
  { id: 'junior', title: 'Junior', subtitle: '1-3 years', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'mid', title: 'Mid-Level', subtitle: '3-5 years', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'senior', title: 'Senior', subtitle: '5+ years', color: 'bg-orange-50 border-orange-200 text-orange-800' },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Configure Your Interview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize your interview experience by selecting your target role, experience level, and uploading your resume for personalized questions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Role Selection */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Select Your Target Role</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-3">{role.icon}</div>
                  <div className="font-semibold text-gray-900 mb-1">{role.title}</div>
                  <div className="text-sm text-gray-500">{role.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Experience Level</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-6 border-2 rounded-xl text-center transition-all hover:shadow-md ${
                    selectedLevel === level.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${level.color}`}>
                    {level.title}
                  </div>
                  <div className="font-medium text-gray-900">{level.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <Upload className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Upload Resume</h2>
              <span className="ml-2 text-sm text-gray-500">(Optional)</span>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600 mb-4">
                {resume ? (
                  <div className="flex items-center justify-center">
                    <span className="text-green-600 font-medium">{resume.name}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">Drop your resume here or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX files</p>
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
                className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block"
              >
                {resume ? 'Change File' : 'Choose File'}
              </label>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startInterview}
              disabled={!selectedRole || !selectedLevel}
              className={`px-12 py-4 rounded-xl text-lg font-semibold transition-all ${
                selectedRole && selectedLevel
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Generate Interview Pipeline
            </button>
            {(!selectedRole || !selectedLevel) && (
              <p className="text-sm text-gray-500 mt-3">
                Please select both role and experience level to continue
              </p>
            )}
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