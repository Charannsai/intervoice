const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];

const replacements = [
  { match: /(?<!dark:)bg-black/g, replace: 'bg-white dark:bg-black' },
  { match: /(?<!dark:)text-white(?!(\/|"))/g, replace: 'text-black dark:text-white' },
  { match: /(?<!dark:)bg-zinc-900/g, replace: 'bg-zinc-100 dark:bg-zinc-900' },
  { match: /(?<!dark:)bg-zinc-800/g, replace: 'bg-zinc-200 dark:bg-zinc-800' },
  { match: /(?<!dark:)border-zinc-800/g, replace: 'border-zinc-300 dark:border-zinc-800' },
  { match: /(?<!dark:)border-zinc-700/g, replace: 'border-zinc-300 dark:border-zinc-700' },
  { match: /(?<!dark:)text-zinc-400/g, replace: 'text-zinc-600 dark:text-zinc-400' },
  { match: /(?<!dark:)text-zinc-300/g, replace: 'text-zinc-700 dark:text-zinc-300' },
  { match: /(?<!dark:)hover:bg-zinc-800/g, replace: 'hover:bg-zinc-200 dark:hover:bg-zinc-800' },
  { match: /(?<!dark:)hover:bg-zinc-900/g, replace: 'hover:bg-zinc-100 dark:hover:bg-zinc-900' },
  { match: /(?<!dark:)hover:text-white/g, replace: 'hover:text-black dark:hover:text-white' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Handle the complex replacement using simple string manipulations
      for (const { match, replace } of replacements) {
        content = content.replace(match, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(path.join(__dirname, dir));
}

console.log('Migration complete');
