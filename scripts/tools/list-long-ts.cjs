#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const THRESHOLD = 105;
const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.expo',
  'vendor',
  '.git',
  'ChatGPT',
]);

const isTsFile = (name) =>
  (name.endsWith('.ts') || name.endsWith('.tsx')) && !name.endsWith('.d.ts');

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(full, out);
    } else if (entry.isFile() && isTsFile(entry.name)) {
      const lines = fs
        .readFileSync(full, 'utf8')
        .split(/\r\n|\n|\r/)
        .length;
      if (lines > THRESHOLD) out.push([path.relative(ROOT, full), lines]);
    }
  }
}

const results = [];
walk(ROOT, results);
results.sort((a, b) => b[1] - a[1]); // по убыванию длины

if (results.length === 0) {
  console.log(`(нет файлов длиннее ${THRESHOLD} строк)`);
  process.exit(0);
}

for (const [file, lines] of results) {
  console.log(`${file}  ${lines}`);
}
