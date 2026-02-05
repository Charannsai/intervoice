'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {
  Rocket, Target, Users, Brain, ArrowRight,
  Code, Globe, Terminal, CheckCircle2, Zap
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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
    <div className="min-h-screen bg-black text-white selection:bg-white/20">

      {/* Subtle Background Grid */}
      <div className="fixed inset-0 z-0 bg-grid-white opacity-[0.03] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 z-10 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              v2.0 Now Available
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
            >
              Master the technical <br />
              <span className="text-zinc-500">interview process.</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
            >
              Enterprise-grade simulations adapted to your resume.
              Practice system design, coding, and behavioral rounds with advanced AI feedback.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 bg-white text-black hover:bg-zinc-200 transition-colors rounded-lg font-medium text-lg flex items-center justify-center gap-2 min-w-[160px]"
              >
                Start Practicing <ArrowRight className="h-4 w-4" />
              </button>
              <button className="px-8 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all rounded-lg font-medium text-lg min-w-[160px]">
                View Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Engineered for performance</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Built by senior engineers for engineers. Move beyond memorization to deep understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Terminal className="h-6 w-6" />,
                title: "Live Coding Environment",
                desc: "Realistic IDE with language support, execution, and complexity analysis."
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: "System Design",
                desc: "Whiteboarding tools and architectural pattern validation for scale."
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Behavioral Analysis",
                desc: "STAR method evaluation with tone and sentiment feedback via voice."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors">
                <div className="h-12 w-12 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid - Condensed */}
      <section className="py-24 px-6 border-b border-white/5 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">

            {/* Large Card */}
            <div className="md:col-span-2 row-span-1 border border-white/10 bg-black p-8 rounded-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Resume-Adaptive</h3>
                <p className="text-zinc-400">Our engine parses your PDF to generate questions relevant to your actual experience level and tech stack stack.</p>
              </div>
              <div className="relative z-10 mt-8 p-4 border border-zinc-800 bg-zinc-900/50 rounded-lg font-mono text-xs text-zinc-300">
                <span className="text-emerald-500">✓</span> Parsed: React, Node.js, AWS<br />
                <span className="text-emerald-500">✓</span> Detected Level: Senior<br />
                <span className="text-blue-500">→</span> Generating L5 System Design round...
              </div>
            </div>

            {/* Tall Card */}
            <div className="md:col-span-1 row-span-1 border border-white/10 bg-black p-8 rounded-xl flex flex-col relative overflow-hidden">
              <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Real-time Feedback</h3>
              <p className="text-zinc-500 text-sm">Instant checks on time complexity and edge cases as you type.</p>
            </div>

            {/* Small Card */}
            <div className="md:col-span-1 row-span-1 border border-white/10 bg-black p-8 rounded-xl flex flex-col relative overflow-hidden">
              <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Global Standards</h3>
              <p className="text-zinc-500 text-sm">Calibrated against rubrics from FAANG and top startups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-8">Trusted by engineers from</h3>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
            {['Google', 'Meta', 'Netflix', 'Uber', 'Stripe'].map((company) => (
              <span key={company} className="text-2xl font-bold text-zinc-300 pointer-events-none">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your career?</h2>
          <p className="text-zinc-400 mb-10 text-lg">
            Join the platform building the next generation of engineering leaders.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-black hover:bg-zinc-200 transition-colors rounded-lg font-medium text-lg inline-flex items-center gap-2"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-white rounded-md flex items-center justify-center">
              <span className="font-bold text-black text-xs">I</span>
            </div>
            <span className="font-bold text-sm text-zinc-300">InterviewAI</span>
          </div>
          <div className="text-zinc-600 text-sm">
            © 2024 InterviewAI Inc.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-600 hover:text-white transition-colors text-sm">Terms</a>
            <a href="#" className="text-zinc-600 hover:text-white transition-colors text-sm">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}