const fs = require('fs');
const path = require('path');

const FORBIDDEN_PATTERN = /\.(test|spec)\.tsx?$/;
const IGNORED_DIRECTORIES = new Set(['node_modules', '.git', 'vendor', '.expo']);
const rootDir = process.cwd();

function findForbiddenTests(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const forbiddenFiles = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }
      const subdir = path.join(directory, entry.name);
      forbiddenFiles.push(...findForbiddenTests(subdir));
    } else if (FORBIDDEN_PATTERN.test(entry.name)) {
      const fullPath = path.join(directory, entry.name);
      forbiddenFiles.push(path.relative(rootDir, fullPath));
    }
  }

  return forbiddenFiles;
}

const forbiddenTests = findForbiddenTests(rootDir);

if (forbiddenTests.length > 0) {
  console.error('Forbidden Jest test files found:');
  forbiddenTests.forEach((file) => console.error(` - ${file}`));
  process.exitCode = 1;
} else {
  console.log('No forbidden Jest test files found.');
}
