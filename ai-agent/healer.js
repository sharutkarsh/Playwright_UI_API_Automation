'use strict';

const fs = require('fs');
const path = require('path');
const { askClaude } = require('./bedrockClient');
const { buildHealerPrompt } = require('./prompts');
const { OUTPUT_TEST_PATH } = require('./generator');

const LOGIN_PAGE_PATH = path.join(__dirname, '../pages/LoginPage.js');

/**
 * Heal the broken generated test by asking Claude to fix the locator.
 * Overwrites tests/ai-generated.spec.js with the fixed code.
 * @param {string} errorOutput - Playwright failure output
 * @returns {Promise<string>} healed test code
 */
async function healTest(errorOutput) {
  const brokenTestCode = fs.readFileSync(OUTPUT_TEST_PATH, 'utf8');
  const pageObjectCode = fs.readFileSync(LOGIN_PAGE_PATH, 'utf8');
  const prompt = buildHealerPrompt(errorOutput, brokenTestCode, pageObjectCode);

  console.log('\n🔧 Test failed. Asking Claude to self-heal the locator...');
  const fixedCode = await askClaude(prompt);

  fs.writeFileSync(OUTPUT_TEST_PATH, fixedCode, 'utf8');
  console.log('✅ Locator healed → tests/ai-generated.spec.js patched');
  return fixedCode;
}

module.exports = { healTest };
