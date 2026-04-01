'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function ProfileSettings() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Email Address</label>
          <input 
            type="email" 
            disabled 
            value={user?.email || ''} 
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-500 mt-2">Your email address is managed through your authentication provider.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Display Name</label>
          <input 
            type="text" 
            defaultValue="Engineer" 
            className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-black dark:text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Role/Title</label>
          <input 
            type="text" 
            defaultValue="Frontend Developer" 
            className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-black dark:text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        <div className="pt-4 border-t border-zinc-300 dark:border-zinc-800">
          <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
