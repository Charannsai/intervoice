const fs = require('fs');
const path = require('path');

const filePaths = [
  'app/start-interview/page.tsx',
  'app/settings/profile/page.tsx',
  'app/page.tsx',
  'app/interview/setup/page.tsx',
  'app/interview/round/page.tsx',
  'app/globals.css',
  'app/interview/results/page.tsx'
];

filePaths.forEach(fp => {
  const p = path.join(__dirname, fp);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace standard button classes
    content = content.replace(/bg-white text-black hover:bg-zinc-200/g, 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200');
    content = content.replace(/bg-white text-black px-6 py-2 rounded-lg/g, 'bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg');
    content = content.replace(/bg-white text-black px-4 py-2/g, 'bg-black dark:bg-white text-white dark:text-black px-4 py-2');
    content = content.replace(/bg-white text-black px-6 py-2 rounded-md/g, 'bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md');
    content = content.replace(/bg-white text-black rounded-md/g, 'bg-black dark:bg-white text-white dark:text-black rounded-md');
    
    // Replace role selection buttons
    content = content.replace(/'bg-white text-black border-white ring-2 ring-white\/20'/g, "'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20'");
    
    // Replace the white borders that got missed
    content = content.replace(/(?<!dark:)border-white(\/| |'|")/g, 'border-black dark:border-white$1');

    // Replace text-white that got missed
    content = content.replace(/(?<!dark:)text-white"/g, 'text-black dark:text-white"');
    
    fs.writeFileSync(p, content, 'utf8');
  }
});

// Also manually fix the `Start your first session` button in dashboard
let dashboard = fs.readFileSync(path.join(__dirname, 'app/dashboard/page.tsx'), 'utf8');
dashboard = dashboard.replace(/className="text-black dark:text-white underline text-sm"/g, 'className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500 underline text-sm"');
fs.writeFileSync(path.join(__dirname, 'app/dashboard/page.tsx'), dashboard, 'utf8');

console.log('Buttons fixed');
