'use client';

import { useState } from 'react';

export default function ThemeSettings() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-6">Theme Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm text-zinc-400 mb-4">Choose how the application looks to you. Right now only dark mode is officially supported, but stay tuned for light mode and system defaults.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border ${theme === 'dark' ? 'border-zinc-300 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-600'} transition-all`}
            >
              <div className="w-full h-24 bg-black border border-zinc-800 rounded-lg p-2 shadow-inner">
                 <div className="h-2 w-1/3 bg-zinc-800 rounded mb-2"></div>
                 <div className="h-10 w-full bg-zinc-900 rounded"></div>
              </div>
              <span className="text-sm font-medium">Dark Mode</span>
            </button>

            <button 
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border ${theme === 'light' ? 'border-zinc-300 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-600'} transition-all opacity-50 cursor-not-allowed`}
              disabled
            >
              <div className="w-full h-24 bg-zinc-100 border border-zinc-300 rounded-lg p-2 shadow-inner">
                 <div className="h-2 w-1/3 bg-zinc-300 rounded mb-2"></div>
                 <div className="h-10 w-full bg-white rounded shadow-sm"></div>
              </div>
              <span className="text-sm font-medium text-zinc-500">Light Mode (Coming Soon)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
