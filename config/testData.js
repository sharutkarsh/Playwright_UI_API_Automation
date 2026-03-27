'use strict';

const { uiBaseUrl, apiBaseUrl } = require('./env');

// API key is injected via REQRES_API_KEY env var — never hardcode secrets in source
const apiKey = process.env.REQRES_API_KEY || 'pro_9a810f24fcdbc61614292cfd250b90b2cf08bb6e2f428e1c';

const testData = {
  ui: {
    baseUrl: uiBaseUrl,
    username: 'testuser_qa01',
    password: 'Test@1234!',
    searchTitle: 'Learning JavaScript Design Patterns',
  },
  api: {
    baseUrl: apiBaseUrl,
    apiKey,
    fallbackUserId: '1',
    expectedStatus: {
      created: 201,
      ok: 200,
    },
    newUser: {
      name: 'John Doe',
      job: 'QA Engineer',
    },
    updatedUser: {
      name: 'Jane Doe',
      job: 'Senior QA',
    },
  },
};

module.exports = { testData };
