# Playwright AI Agent — Self-Healing Test Generator

An AI-powered CLI agent built on top of this Playwright framework that can **generate**, **run**, and **self-heal** tests from plain English — powered by **Amazon Bedrock (Claude 3.5 Sonnet)**.

---

## What It Does

Traditional test automation breaks the moment a developer renames a button or changes an attribute. Someone has to manually find the broken locator and fix it.

This agent does that automatically:

1. You describe a test scenario in plain English
2. Claude generates a Playwright test file
3. The test runs — and fails due to a locator mismatch (simulating real-world UI drift)
4. The agent reads the error, sends it back to Claude along with your real page objects as ground truth
5. Claude patches the broken locator
6. The test reruns and passes ✅

No Playwright knowledge needed to create a test. No manual debugging when it breaks.

---

## Agent File Structure

```
ai-agent/
├── agent.js          # CLI orchestrator — ties all steps together
├── bedrockClient.js  # AWS Bedrock wrapper for Claude API calls
├── generator.js      # Step 1: generates test from plain English via Claude
├── healer.js         # Step 3: reads error + patches broken locator via Claude
├── prompts.js        # All Claude prompt templates in one place
└── runner.js         # Runs Playwright and captures pass/fail + output
```

---

## How It Works — Step by Step

```
You type a scenario
        │
        ▼
┌─────────────────────┐
│   generator.js      │  Reads LoginPage.js → sends scenario + page object to Claude
│   (Claude call #1)  │  Claude writes a test with one intentionally wrong XPath
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   runner.js         │  Runs: npx playwright test tests/ai-generated.spec.js
│   (First run)       │  Result: ❌ FAIL — locator not found
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   healer.js         │  Sends: error output + broken test + LoginPage.js to Claude
│   (Claude call #2)  │  Claude fixes the XPath using page object as ground truth
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   runner.js         │  Reruns: npx playwright test tests/ai-generated.spec.js
│   (Second run)      │  Result: ✅ PASS — self-healing successful
└─────────────────────┘
```

---

## Prerequisites

### 1. AWS Account with Bedrock Access

Enable model access in the AWS Console:

```
AWS Console → Amazon Bedrock → Model access → Enable:
  ✅ Claude 3.5 Sonnet (anthropic.claude-3-5-sonnet-20240620-v1:0)
```

### 2. AWS Credentials Configured Locally

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1`

### 3. Dependencies Already Installed

The AWS SDK is included in `devDependencies`. If starting fresh:

```bash
npm ci
```

---

## Running the Agent

```bash
npm run ai-agent
```

You will see:

```
────────────────────────────────────────────────────────────
  🎭 Playwright AI Agent — Self-Healing Test Generator
  Powered by Amazon Bedrock (Claude 3.5 Sonnet)
────────────────────────────────────────────────────────────

📝 Describe your test scenario in plain English:
> Test that a user can login and see their username on the profile page
```

### Example Scenarios to Try

```
Test that a user can login and see their username on the profile page
Test that logging out redirects the user back to the login page
Test that an invalid password shows an error message
Test that the username field is visible on the login page
```

---

## What Gets Generated

The agent writes to `tests/ai-generated.spec.js` — overwritten on every run.

**Example generated test (before healing):**
```js
// ai-generated.spec.js
const { test, expect } = require('@playwright/test');

test('User can login and see username', async ({ page }) => {
  await test.step('Navigate to login page', async () => {
    await page.goto('https://demoqa.com/login');
  });

  await test.step('Fill credentials', async () => {
    await page.locator('//input[@id="user-name"]').fill('testuser_qa01'); // WRONG_LOCATOR
    await page.locator('//input[@id="password"]').fill('Test@1234!');
    await page.locator('//button[@id="login"]').click();
  });

  await test.step('Assert username is visible', async () => {
    await expect(page.locator('//label[@id="userName-value"]')).toBeVisible();
  });
});
```

**After healing** — Claude corrects `user-name` → `userName` using LoginPage.js as reference.

---

## Architecture Decisions

| Decision | Reason |
|---|---|
| Amazon Bedrock over OpenAI | Runs inside your AWS account — no third-party data sharing, enterprise-ready |
| Claude 3.5 Sonnet | Best balance of code quality and speed for test generation tasks |
| Page objects as healing ground truth | Claude fixes locators against your real, working code — not guesswork |
| `// WRONG_LOCATOR` comment | Makes the broken line explicit so Claude knows exactly what to fix |
| Separate `prompts.js` | Prompt templates are easy to tune without touching orchestration logic |
| `tests/ai-generated.spec.js` | Kept outside `ai-agent/` so Playwright picks it up with zero config changes |

---

## Extending the Agent

**Support more page objects for generation:**
In `generator.js`, read additional page objects (e.g. `BooksStorePage.js`) and include them in the prompt for richer test generation.

**Multi-heal loop:**
In `agent.js`, wrap the heal → rerun steps in a `for` loop (max 3 attempts) for stubborn failures.

**Slack/Teams notification:**
After the final result in `agent.js`, POST the outcome to a webhook for team visibility.

**CI integration:**
Add a separate GitHub Actions job that runs `npm run ai-agent` with a predefined scenario as an environment variable — fully automated AI test generation in the pipeline.

---

## Author

**Utkarsh Sharma**
