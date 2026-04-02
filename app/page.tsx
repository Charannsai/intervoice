'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {
  Brain, ArrowRight,
  Terminal, Users, Code, Zap
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
      if (user) {
        router.push('/dashboard');
      } else {
        setUser(null);
      }
    };
    checkUser();

    // Listen for auth state changes as well to handle redirect immediately after login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push('/dashboard');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-zinc-200 dark:selection:bg-zinc-800">

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 dark:bg-zinc-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500 dark:bg-zinc-400"></span>
              </span>
              v2.0 Now Available
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white mb-6 leading-[1.1]"
            >
              Master the technical <br />
              <span className="text-zinc-400 dark:text-zinc-500">interview process.</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed"
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
                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-md font-medium text-sm flex items-center justify-center gap-2 min-w-[140px]"
              >
                Start Practicing <ArrowRight className="h-4 w-4" />
              </button>
              <button className="px-6 py-2.5 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors rounded-md font-medium text-sm min-w-[140px]">
                View Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold mb-4">Engineered for performance</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm">
              Built by senior engineers for engineers. Move beyond memorization to deep understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Terminal className="h-5 w-5" />,
                title: "Live Coding Environment",
                desc: "Realistic IDE with language support, execution, and complexity analysis."
              },
              {
                icon: <Brain className="h-5 w-5" />,
                title: "System Design",
                desc: "Whiteboarding tools and architectural pattern validation for scale."
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: "Behavioral Analysis",
                desc: "STAR method evaluation with tone and sentiment feedback via voice."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg flex items-center justify-center mb-4 text-black dark:text-white border border-zinc-200 dark:border-zinc-800">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Stats/Bento */}
      <section className="py-24 px-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-8 rounded-2xl">
              <Code className="h-6 w-6 mb-4 text-zinc-400" />
              <h3 className="text-xl font-semibold mb-2">Resume-Adaptive</h3>
              <p className="text-zinc-500 text-sm mb-6">Our engine parses your PDF to generate questions relevant to your actual experience level and tech stack stack.</p>
              <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-lg font-mono text-xs text-zinc-600 dark:text-zinc-400">
                <span className="text-black dark:text-white">✓</span> Parsed: React, Node.js, AWS<br />
                <span className="text-black dark:text-white">✓</span> Detected Level: Senior<br />
                <span className="text-black dark:text-white">→</span> Generating L5 System Design round...
              </div>
            </div>

            <div className="grid grid-rows-2 gap-8">
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-8 rounded-2xl">
                <Zap className="h-6 w-6 mb-4 text-zinc-400" />
                <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
                <p className="text-zinc-500 text-sm">Instant checks on time complexity and edge cases as you type.</p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-8 rounded-2xl flex items-center justify-center">
                 <div className="text-center">
                   <h3 className="text-3xl font-bold mb-1">Global Standards</h3>
                   <p className="text-zinc-500 text-sm">Calibrated against top tech rubrics.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 border-t border-zinc-100 dark:border-zinc-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-8">Trusted by engineers from</h3>
          <div className="flex flex-wrap justify-center gap-12 sm:gap-16 opacity-50 grayscale">
            {['Google', 'Meta', 'Netflix', 'Uber', 'Stripe'].map((company) => (
              <span key={company} className="text-xl font-bold text-black dark:text-white pointer-events-none">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to upgrade your career?</h2>
          <p className="text-zinc-500 mb-8 text-sm">
            Join the platform building the next generation of engineering leaders.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-md font-medium text-sm inline-flex items-center gap-2"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 bg-zinc-50 dark:bg-black">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-black dark:bg-white rounded flex items-center justify-center">
              <span className="font-bold text-white dark:text-black text-[10px]">I</span>
            </div>
            <span className="font-medium text-sm text-black dark:text-white">InterviewAI</span>
          </div>
          <div className="text-zinc-500 text-xs">
            © 2024 InterviewAI Inc.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors text-xs">Terms</a>
            <a href="#" className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors text-xs">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}