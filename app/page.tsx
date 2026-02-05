'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {
  Rocket, Target, Users, Brain, ArrowRight, Star,
  Code, Cpu, Shield, Zap, Globe, Sparkles
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
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
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-indigo-500/30">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-sm text-indigo-400 mb-8 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Interview Intelligence 2.0</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Master Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 animate-shimmer bg-[length:200%_auto]">
              Technical Interview
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience realistic, multi-round simulations adapted to your resume and role.
            Powered by advanced Gemini AI for enterprise-grade evaluation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              Start Simulation <ArrowRight className="h-5 w-5" />
            </button>
            <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-xl font-semibold text-lg transition-all flex items-center gap-2 hover:border-slate-700">
              View Demo
            </button>
          </motion.div>

          {/* Dashboard Preview / Floating UI Elements */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl">
              <div className="bg-slate-900/50 rounded-xl overflow-hidden aspect-[16/9] relative grid place-items-center border border-slate-800/50">
                <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
                <div className="text-center relative z-10">
                  <div className="w-24 h-24 bg-indigo-500/20 rounded-full mx-auto mb-4 grid place-items-center animate-pulse-glow">
                    <Rocket className="h-10 w-10 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Ready for Lift Off?</h3>
                  <p className="text-slate-400">Initialize your first interview session</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 relative z-10 border-t border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Engineered for Excellence</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our platform uses state-of-the-art AI to simulate the pressure and complexity
              of real-world technical interviews.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Large Card */}
            <motion.div variants={itemVariants} className="md:col-span-2 glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="h-64 w-64 text-indigo-500" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Adaptive AI Analysis</h3>
                <p className="text-slate-400 text-lg max-w-md">
                  Our Gemini-powered engine adapts questions in real-time based on your responses,
                  probing deeper into your knowledge just like a senior engineer would.
                </p>
              </div>
            </motion.div>

            {/* Tall Card */}
            <motion.div variants={itemVariants} className="md:col-span-1 glass-card p-8 rounded-3xl relative overflow-hidden group row-span-2">
              <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="h-48 w-48 text-emerald-500" />
              </div>
              <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Role-Specific</h3>
              <ul className="space-y-4 text-slate-400">
                {['Frontend', 'Backend', 'System Design', 'DevOps', 'Data Science'].map((role) => (
                  <li key={role} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {role}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div variants={itemVariants} className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:border-violet-500/50 transition-colors">
              <div className="h-12 w-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Feedback</h3>
              <p className="text-slate-400">Get instant, granular feedback on your communication and technical accuracy.</p>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div variants={itemVariants} className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
              <div className="h-12 w-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <BadgeCheck className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Resume Parsing</h3>
              <p className="text-slate-400">Upload your resume to get questions tailored specifically to your experience.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-12 border border-slate-800">
            <div className="grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
              <div className="p-4">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-cyan-400 mb-2">10k+</div>
                <div className="text-slate-500 font-medium tracking-wide uppercase text-sm">Interviews Completed</div>
              </div>
              <div className="p-4">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-400 mb-2">85%</div>
                <div className="text-slate-500 font-medium tracking-wide uppercase text-sm">Success Rate</div>
              </div>
              <div className="p-4">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-fuchsia-400 mb-2">50+</div>
                <div className="text-slate-500 font-medium tracking-wide uppercase text-sm">Job Roles Supported</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-16">Trusted by Engineers at</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mb-20">
            {/* Tech Company Logos placeholders - using text for now or simple icons */}
            {['Google', 'Microsoft', 'Amazon', 'Netflix', 'Meta'].map((company) => (
              <span key={company} className="text-2xl font-bold text-slate-400">{company}</span>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The system design round simulation was shockingly accurate. It helped me land my L5 role.",
                author: "Sarah Chen",
                role: "Senior Engineer",
                company: "Google"
              },
              {
                quote: "I used to freeze up during live coding. The realistic pressure simulation built my confidence.",
                author: "Michael R.",
                role: "Backend Dev",
                company: "Microsoft"
              },
              {
                quote: "The feedback on my behavioral answers was more useful than any mockup interview I've paid for.",
                author: "Priya Patel",
                role: "Product Manager",
                company: "Amazon"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl relative"
              >
                <div className="flex mb-6 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-xs text-slate-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Ace Your Next Interview?
            </h3>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have mastered their interview skills with our AI platform.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Rocket className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-lg text-slate-200">InterviewAI</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 SysBot Interview Simulator. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors"><Globe className="h-5 w-5" /></a>
            <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors"><Code className="h-5 w-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}