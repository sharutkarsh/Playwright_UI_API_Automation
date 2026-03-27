# Playwright Automation Framework

Production-grade hybrid UI + API automation framework built with [Playwright](https://playwright.dev) and JavaScript (CommonJS).

---

## Framework Highlights

| Capability | Detail |
|---|---|
| Hybrid UI + API | UI flows and REST API CRUD tests in a single unified framework |
| Separation of concerns | Tests, page objects, API client, services, and utils are fully decoupled |
| API-based test data setup | `UserService` creates test data via API — faster and more reliable than UI setup |
| Parallel execution | Configurable workers (`CI=2`, local=`4`) with per-browser matrix in GitHub Actions |
| Flakiness reduction | No hard waits — all waits use Playwright's built-in auto-wait and `expect` assertions |
| Stable locators | Role-based and `#id` locators throughout — no brittle XPath |
| Environment support | `TEST_ENV=dev\|qa\|prod` switches base URLs without touching test code |
| Secret management | API keys injected via env vars — never hardcoded in source |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Test Layer                        │
│         tests/ui/         tests/api/                │
│   (intent-focused, no setup plumbing)               │
└────────────────────┬────────────────────────────────┘
                     │ uses
┌────────────────────▼────────────────────────────────┐
│                 Fixture Layer                        │
│              fixtures/testFixture.js                │
│   (wires page objects, apiClient, userService)      │
└──────┬──────────────────────────┬───────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼────────┐
│  Page Layer │          │  Service Layer  │
│  pages/*.js │          │ services/*.js   │
│  (UI only)  │          │ (API setup)     │
└──────┬──────┘          └────────┬────────┘
       │                          │
┌──────▼──────────────────────────▼────────┐
│              Utility Layer               │
│   utils/apiClient.js   utils/helpers.js  │
└──────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│              Config Layer               │
│  config/env.js → config/testData.js     │
│  (env-aware, secret-safe)               │
└─────────────────────────────────────────┘
```

**Key design decisions:**
- Tests only import from `fixtures/` — they never instantiate page objects or services directly
- `UserService` sits between the test and `ApiClient` — tests express *what* to set up, not *how*
- `config/env.js` is the single source of truth for environment-specific URLs

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & API testing |
| JavaScript (CommonJS) | Test authoring |
| Node.js 20 | Runtime |
| reqres.in | Custom collection API backend for CRUD tests |
| demoqa.com | UI test application |
| GitHub Actions | CI/CD pipeline |

---

## Project Structure

```
playwright-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml   # GitHub Actions CI/CD pipeline
├── config/
│   ├── env.js               # Environment config (dev/qa/prod) — driven by TEST_ENV
│   └── testData.js          # Centralized test data (credentials, URLs — no secrets)
├── fixtures/
│   └── testFixture.js       # Playwright fixture wiring all page objects, API client & services
├── pages/
│   ├── BasePage.js          # Base class with shared actions and assertions
│   ├── LoginPage.js         # Login/logout page object
│   └── BooksStorePage.js    # Book Store page object
├── services/
│   └── userService.js       # API-based test data setup (create/manage users)
├── tests/
│   ├── ui/
│   │   └── ui.spec.js       # UI end-to-end test (DemoQA Book Store)
│   └── api/
│       └── api.spec.js      # API CRUD tests (reqres.in custom collection)
├── utils/
│   ├── apiClient.js         # HTTP client wrapper for reqres.in collection API
│   └── helpers.js           # File utilities (writeResults)
├── results/
│   └── results.txt          # Book details output (auto-cleared before each run)
├── playwright.config.js     # Playwright configuration
├── jsconfig.json            # JS/VS Code config
└── package.json
```

---

## Page Object Structure

Every page follows this consistent pattern:

```js
class ExamplePage extends BasePage {

  // ================= LOCATORS =================
  // Prefer role-based or #id locators over XPath for stability
  this.someElement = page.getByRole('button', { name: 'Submit' });

  // ================= ACTIONS =================
  async doSomething() { ... }

  // ================= ASSERTIONS =================
  async assertSomething() { ... }
}
```

---

## Test Flows

### UI — DemoQA Book Store (`tests/ui/ui.spec.js`)

| Step | Action |
|---|---|
| 1 | Navigate to Login page |
| 2 | Login with registered user |
| 3 | Validate username and logout button are visible |
| 4 | Navigate to Book Store via home page button |
| 5 | Search for "Learning JavaScript Design Patterns" |
| 6 | Validate book appears in search results |
| 7 | Open book, extract Title / Author / Publisher → write to `results/results.txt` |
| 8 | Navigate back and logout |

### API — reqres.in CRUD (`tests/api/api.spec.js`)

| Step | Action |
|---|---|
| 1 | `POST /records` — Create user, validate 201, store userId |
| 2 | `GET /records/{id}` — Fetch created user, validate name and job |
| 3 | `PUT /records/{id}` — Update user name, validate updated fields |

---

## Setup

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install chromium --with-deps
```

---

## Pre-requisites

### UI Tests
Register a user at [https://demoqa.com/register](https://demoqa.com/register) and update credentials in `config/testData.js`:

```js
ui: {
  username: 'your_username',
  password: 'your_password',
}
```

### API Tests
A custom reqres.in collection is already configured. The API key and endpoint are set in `config/testData.js`. No additional setup needed.

---

## Running Tests

```bash
# Run all tests (clears results.txt first)
npm test

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run in headed mode (see the browser)
npm run test:headed

# Open Playwright interactive UI mode
npm run test:ui-mode

# Debug a specific test
npm run test:debug

# Open HTML report after run
npm run report
```

---

## Configuration

### Environment switching

Set `TEST_ENV` to target a specific environment. Defaults to `qa`.

```bash
TEST_ENV=dev npm test
TEST_ENV=prod npm test
```

Environment URLs are defined in `config/env.js`. Add new environments there — no test changes needed.

### API Key

Set `REQRES_API_KEY` as an environment variable or GitHub Secret. Never commit it to source.

```bash
export REQRES_API_KEY=your_key_here
npm test
```

### Test data

All non-secret test data lives in `config/testData.js`:

```js
const testData = {
  ui: {
    baseUrl: 'https://demoqa.com',
    username: 'testuser_qa01',
    password: 'Test@1234!',
    searchTitle: 'Learning JavaScript Design Patterns',
  },
  api: {
    baseUrl: 'https://reqres.in/api/collections/testapi-utkarsh/records',
    apiKey: '<your_api_key>',
    expectedStatus: { created: 201, ok: 200 },
    newUser:     { name: 'John Doe', job: 'QA Engineer' },
    updatedUser: { name: 'Jane Doe', job: 'Senior QA' },
  },
};
```

---

## Reporting

| Report type | Location | When generated |
|---|---|---|
| HTML report | `reports/html/index.html` | Every run |
| JUnit XML | `reports/junit/results.xml` | Every run |
| Allure results | `reports/allure-results/` | Every run |
| Allure HTML | `reports/allure-report/` | After `npm run report:allure` |
| Book details | `results/results.txt` | Every UI run (cleared before run) |
| Screenshots | `reports/html/` | On failure only |
| Video | `reports/html/` | On first retry |
| Trace | `reports/html/` | On first retry |

```bash
# Open Playwright HTML report
npm run report

# Generate and open Allure report
npm run report:allure
```

---

## CI/CD — GitHub Actions

The pipeline triggers on every push and pull request to `main`/`master`.

Tests run **in parallel across 4 browsers** — each on its own cloud machine simultaneously.

### Matrix Strategy

| Machine | Browser |
|---|---|
| ubuntu-latest #1 | Chromium |
| ubuntu-latest #2 | Firefox |
| ubuntu-latest #3 | WebKit |
| ubuntu-latest #4 | Edge |

### Pipeline Steps (per machine)

| Step | Action |
|---|---|
| 1 | Checkout code |
| 2 | Setup Node.js 20 |
| 3 | Install dependencies via `npm ci` |
| 4 | Install only the required browser with `--with-deps` |
| 5 | Run tests for that browser via `--project=<browser>` |
| 6 | Upload HTML report as artifact (retained 14 days) |
| 7 | Upload test results and traces as artifact (retained 14 days) |
| 8 | Upload Allure results as artifact (retained 14 days) |

`fail-fast: false` ensures all 4 browsers complete even if one fails.

### GitHub Secrets Setup

Add the following secret to your repository under `Settings → Secrets and variables → Actions`:

| Secret | Value |
|---|---|
| `REQRES_API_KEY` | Your reqres.in pro API key |

---

## Author

**Utkarsh Sharma**
