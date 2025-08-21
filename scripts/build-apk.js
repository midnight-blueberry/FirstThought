const { spawnSync } = require('child_process');
const path = require('path');

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(
  'npx',
  ['expo', 'run:android', '--variant', 'release', '--no-install', '--no-bundler'],
  { env: { ...process.env, CI: '1' } }
);

console.log(
  'APK generated at',
  path.join('android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')
);
