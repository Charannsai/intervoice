const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];

const replacements = [
  // Fix the missed classes matching literally at end of string or before space
  { match: /(?<!dark:)text-white(?=\s|"|')/g, replace: 'text-black dark:text-white' },
  { match: /(?<!dark:)bg-black(?=\s|"|')/g, replace: 'bg-white dark:bg-black' },
  
  // Inverse items (elements that were white in Dark mode should be black in Light mode)
  { match: /(?<!dark:)bg-white(?=\s|"|')/g, replace: 'bg-black dark:bg-white' },
  { match: /(?<!dark:)text-black(?=\s|"|')/g, replace: 'text-white dark:text-black' },

  // Primary buttons hovering (hover:bg-zinc-200) -> hover:bg-zinc-800 dark:hover:bg-zinc-200
  { match: /(?<!dark:)hover:bg-zinc-200(?=\s|"|')/g, replace: 'hover:bg-zinc-800 dark:hover:bg-zinc-200' },

  // Borders that were white/10
  { match: /(?<!dark:)border-white\/10/g, replace: 'border-black/10 dark:border-white/10' },
  { match: /(?<!dark:)border-white\/5/g, replace: 'border-black/5 dark:border-white/5' },
  { match: /(?<!dark:)border-white\/30/g, replace: 'border-black/30 dark:border-white/30' },
  
  // Specific issues like the Dashboard cards where border-black/10 helps
  { match: /(?<!dark:)border-white/g, replace: 'border-black dark:border-white' },

  // Any background/foreground that got double replaced by accident will be manually cleaned up if needed
];

// Reverting double matches if they occur
const revertDoubles = [
  { match: /bg-white dark:bg-black dark:bg-white/g, replace: 'bg-white dark:bg-black' },
  { match: /text-black dark:text-white dark:text-black/g, replace: 'text-black dark:text-white' },
  { match: /bg-black dark:bg-white dark:bg-black/g, replace: 'bg-black dark:bg-white' },
  { match: /text-white dark:text-black dark:text-white/g, replace: 'text-white dark:text-black' },
  { match: /border-black dark:border-white\/10/g, replace: 'border-black/10 dark:border-white/10' },
  { match: /border-black dark:border-white\/5/g, replace: 'border-black/5 dark:border-white/5' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      // Don't modify the theme definitions or layout since I hardcoded them nicely
      if (fullPath.includes('ThemeProvider') || fullPath.includes('theme')) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { match, replace } of replacements) {
        content = content.replace(match, replace);
      }
      for (const { match, replace } of revertDoubles) {
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

console.log('Migration Phase 2 complete');
