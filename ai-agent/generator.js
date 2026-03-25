'use strict';

const fs = require('fs');
const path = require('path');
const { askClaude } = require('./bedrockClient');
const { buildGeneratorPrompt } = require('./prompts');

const LOGIN_PAGE_PATH = path.join(__dirname, '../pages/LoginPage.js');
const OUTPUT_TEST_PATH = path.join(__dirname, '../tests/ai-generated.spec.js');

/**
 * Generate a Playwright test file from a plain English scenario.
 * Writes the result to tests/ai-generated.spec.js.
 * @param {string} scenario
 * @returns {Promise<string>} generated test code
 */
async function generateTest(scenario) {
  const pageObjectCode = fs.readFileSync(LOGIN_PAGE_PATH, 'utf8');
  const prompt = buildGeneratorPrompt(scenario, pageObjectCode);

  console.log('\n🤖 Asking Claude to generate test...');
  const code = await askClaude(prompt);

  fs.writeFileSync(OUTPUT_TEST_PATH, code, 'utf8');
  console.log(`✅ Test generated → tests/ai-generated.spec.js`);
  return code;
}

module.exports = { generateTest, OUTPUT_TEST_PATH };
