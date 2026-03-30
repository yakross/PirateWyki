const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (!filepath.includes('node_modules') && !filepath.includes('.git') && !filepath.includes('.gemini')) {
        walk(filepath, filelist);
      }
    } else if (file.endsWith('.html')) {
        filelist.push(filepath);
    }
  }
  return filelist;
}

const htmlFiles = walk('./');
let updatedCount = 0;
// Regular expression to match any tracker.html link in a nav-item li
const navRegex = /<li class="nav-item">\s*<a href="[^"]*tracker\.html"\s+class="nav-link[^"]*">\s*<i class="[^"]*"><\/i>\s*Tracker\s*<\/a>\s*<\/li>\s*/g;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.match(navRegex)) {
      content = content.replace(navRegex, '');
      fs.writeFileSync(file, content);
      updatedCount++;
      console.log('Removed tracker link in: ' + file);
  }
}
console.log('Total files updated: ' + updatedCount);
