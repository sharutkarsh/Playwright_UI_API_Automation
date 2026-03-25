'use strict';

/**
 * Prompt templates for Claude — kept separate so they're easy to tweak.
 */

function buildGeneratorPrompt(scenario, pageObjectCode) {
  return `You are a Playwright test automation expert.

Your job is to generate a single Playwright test file in JavaScript (CommonJS) for the following scenario:

SCENARIO: "${scenario}"

The app under test is https://demoqa.com.
Credentials: username = "testuser_qa01", password = "Test@1234!"

Here is the existing LoginPage page object for reference:
\`\`\`js
${pageObjectCode}
\`\`\`

RULES:
1. Output ONLY raw JavaScript code — no markdown, no backticks, no explanation.
2. Use @playwright/test with CommonJS require().
3. Use XPath locators only (page.locator('//xpath')).
4. Intentionally use a slightly wrong XPath for ONE locator (e.g. wrong attribute value or wrong tag) so the test fails on first run — this simulates a real-world locator mismatch. Add a comment // WRONG_LOCATOR on that line.
5. Wrap each logical action in test.step().
6. Keep it minimal — only what the scenario asks for.
7. Do NOT import any page objects — write all locators inline in the test.`;
}

function buildHealerPrompt(errorOutput, brokenTestCode, pageObjectCode) {
  return `You are a Playwright self-healing test expert.

A Playwright test failed. Your job is to fix ONLY the broken locator and return the corrected full test file.

FAILED TEST CODE:
\`\`\`js
${brokenTestCode}
\`\`\`

ERROR OUTPUT:
\`\`\`
${errorOutput}
\`\`\`

REFERENCE — the real working page object (use these locators as ground truth):
\`\`\`js
${pageObjectCode}
\`\`\`

RULES:
1. Output ONLY the corrected raw JavaScript — no markdown, no backticks, no explanation.
2. Fix ONLY the locator(s) causing the failure — do not change anything else.
3. Remove the // WRONG_LOCATOR comment from the fixed line.
4. Keep all test.step() wrappers intact.`;
}

module.exports = { buildGeneratorPrompt, buildHealerPrompt };
