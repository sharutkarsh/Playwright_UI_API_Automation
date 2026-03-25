'use strict';

const readline = require('readline');
const { generateTest } = require('./generator');
const { runTest } = require('./runner');
const { healTest } = require('./healer');

const DIVIDER = '─'.repeat(60);

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}

async function main() {
  console.log('\n' + DIVIDER);
  console.log('  🎭 Playwright AI Agent — Self-Healing Test Generator');
  console.log('  Powered by Amazon Bedrock (Claude 3.5 Sonnet)');
  console.log(DIVIDER);

  const scenario = await prompt('\n📝 Describe your test scenario in plain English:\n> ');

  if (!scenario) {
    console.log('❌ No scenario provided. Exiting.');
    process.exit(1);
  }

  console.log('\n' + DIVIDER);

  // ── Step 1: Generate ──────────────────────────────────────
  await generateTest(scenario);

  // ── Step 2: First Run ─────────────────────────────────────
  console.log('\n' + DIVIDER);
  const firstRun = runTest();

  if (firstRun.passed) {
    console.log('\n' + DIVIDER);
    console.log('✅ Test passed on first run! No healing needed.');
    console.log(DIVIDER);
    process.exit(0);
  }

  // ── Step 3: Heal ──────────────────────────────────────────
  console.log('\n' + DIVIDER);
  await healTest(firstRun.output);

  // ── Step 4: Retry ─────────────────────────────────────────
  console.log('\n' + DIVIDER);
  console.log('🔁 Retrying with healed test...');
  const secondRun = runTest();

  console.log('\n' + DIVIDER);
  if (secondRun.passed) {
    console.log('🎉 Self-healing successful! Test now passes.');
  } else {
    console.log('❌ Test still failing after healing. Manual review needed.');
    console.log('\nFinal error output:');
    console.log(secondRun.output);
    process.exit(1);
  }
  console.log(DIVIDER + '\n');
}

main().catch((err) => {
  console.error('\n❌ Agent error:', err.message);
  process.exit(1);
});
