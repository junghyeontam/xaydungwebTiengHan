const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results.push(...walk(fullPath));
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('src');
const tablePattern = /\.from\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
const foundTables = new Set();
const tableOccurrences = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = tablePattern.exec(content)) !== null) {
    const table = match[1];
    foundTables.add(table);
    if (!tableOccurrences[table]) tableOccurrences[table] = [];
    tableOccurrences[table].push(file);
  }
}

console.log('--- TABLES REFERENCED IN SRC ---');
console.log(Array.from(foundTables));

// Also check legacy_* references
console.log('--- LEGACY_* REFERENCES ---');
const legacyFiles = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('legacy_')) {
    legacyFiles.push(file);
  }
}
console.log(legacyFiles);
