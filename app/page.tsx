'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Upload, Rocket, Target, Users, Brain, ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react';

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
  { id: 'fresher', title: 'Fresher (0-1 years)' },
  { id: 'junior', title: 'Junior (1-3 years)' },
  { id: 'mid', title: 'Mid-Level (3-5 years)' },
  { id: 'senior', title: 'Senior (5+ years)' },
];

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Real-Time
            <span className="text-blue-600"> Interview Simulator</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience realistic multi-round interviews that adapt to your role, resume, and performance. 
            Powered by Gemini AI for dynamic content generation and evaluation.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Role-Specific</h3>
              <p className="text-gray-600 text-sm">Tailored rounds based on your selected job role</p>
            </div>
            <div className="text-center">
              <Brain className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">Dynamic questions and real-time evaluation</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Multi-Round</h3>
              <p className="text-gray-600 text-sm">Complete interview pipeline simulation</p>
            </div>
            <div className="text-center">
              <Upload className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Resume-Based</h3>
              <p className="text-gray-600 text-sm">Questions adapted to your background</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview skills with our AI-powered platform.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Interviews Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Job Roles Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The AI-powered questions were incredibly realistic. I felt fully prepared for my actual interview."
              </p>
              <div className="font-semibold text-gray-900">Sarah Chen</div>
              <div className="text-sm text-gray-500">Software Engineer at Google</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The multi-round format exactly matched my company's interview process. Highly recommended!"
              </p>
              <div className="font-semibold text-gray-900">Michael Rodriguez</div>
              <div className="text-sm text-gray-500">Product Manager at Microsoft</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The detailed feedback helped me identify my weak areas and improve significantly."
              </p>
              <div className="font-semibold text-gray-900">Priya Patel</div>
              <div className="text-sm text-gray-500">Data Scientist at Amazon</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}