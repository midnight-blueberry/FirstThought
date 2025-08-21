const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const androidDir = path.join(process.cwd(), 'android');

if (!fs.existsSync(androidDir)) {
  run('npx', ['expo', 'prebuild', '--platform', 'android', '--no-install'], {
    env: { ...process.env, CI: '1' },
  });
}

const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradlew, ['assembleRelease'], {
  cwd: androidDir,
  shell: process.platform === 'win32',
});

console.log(
  'APK generated at',
  path.join('android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')
);
