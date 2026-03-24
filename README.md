# Playwright Automation Framework

Production-grade hybrid UI + API automation framework built with [Playwright](https://playwright.dev) and JavaScript (CommonJS).

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
│   └── testData.js          # Centralized test data (credentials, API keys, URLs)
├── fixtures/
│   └── testFixture.js       # Playwright fixture wiring all page objects & API client
├── pages/
│   ├── BasePage.js          # Base class with shared actions and assertions
│   ├── LoginPage.js         # Login/logout page object
│   └── BooksStorePage.js    # Book Store page object
├── tests/
│   ├── ui.spec.js           # UI end-to-end test (DemoQA Book Store)
│   └── api.spec.js          # API CRUD tests (reqres.in custom collection)
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
  this.someElement = page.locator('//xpath');

  // ================= ACTIONS =================
  async doSomething() { ... }

  // ================= ASSERTIONS =================
  async assertSomething() { ... }
}
```

---

## Test Flows

### UI — DemoQA Book Store (`tests/ui.spec.js`)

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

### API — reqres.in CRUD (`tests/api.spec.js`)

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

All test data lives in `config/testData.js`:

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
| HTML report | `playwright-report/index.html` | Every run |
| JUnit XML | `test-results/results.xml` | Every run |
| Book details | `results/results.txt` | Every UI run (cleared before run) |
| Screenshots | `test-results/` | On failure only |
| Video | `test-results/` | On first retry |
| Trace | `test-results/` | On first retry |

```bash
# Open HTML report
npm run report
```

---

## CI/CD — GitHub Actions

The pipeline triggers on every push and pull request to `main`/`master`.

### Pipeline Steps

| Step | Action |
|---|---|
| 1 | Checkout code |
| 2 | Setup Node.js 20 |
| 3 | Install dependencies via `npm ci` |
| 4 | Install Chromium with system dependencies (`--with-deps`) |
| 5 | Run all tests via `npm test` |
| 6 | Upload HTML report as artifact (retained 14 days) |
| 7 | Upload test results and traces as artifact (retained 14 days) |

### GitHub Secrets Setup

Add the following secret to your repository under `Settings → Secrets and variables → Actions`:

| Secret | Value |
|---|---|
| `REQRES_API_KEY` | Your reqres.in pro API key |

---

## Author

**Utkarsh Sharma**
