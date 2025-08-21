const { spawnSync } = require('child_process');
const path = require('path');

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('npx', ['expo', 'prebuild'], { env: { ...process.env, CI: '1' } });

const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradleCmd, ['assembleRelease'], { cwd: path.join(process.cwd(), 'android') });
