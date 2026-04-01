'use client';

export default function GeneralSettings() {
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-6">General Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Interview Difficulty Level</label>
          <select className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-500 transition-colors">
            <option value="easy">Easy - Focused on basic concepts</option>
            <option value="medium">Medium - Standard industry level</option>
            <option value="hard">Hard - FAANG/Top tier startup level</option>
          </select>
          <p className="text-xs text-zinc-500 mt-2">This sets the default AI harshness during your mock interviews.</p>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-medium text-red-500 mb-2">Danger Zone</h3>
          <p className="text-xs text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
