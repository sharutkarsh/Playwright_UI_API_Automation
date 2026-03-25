'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/**
 * Run the AI-generated spec file with Playwright.
 * @returns {{ passed: boolean, output: string }}
 */
function runTest() {
  const cmd = `npx playwright test tests/ai-generated.spec.js --project=chromium --reporter=line`;
  console.log('\n▶️  Running test with Playwright...\n');

  try {
    const output = execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
    console.log(output);
    return { passed: true, output };
  } catch (err) {
    const output = (err.stdout || '') + (err.stderr || '');
    console.log(output);
    return { passed: false, output };
  }
}

module.exports = { runTest };
