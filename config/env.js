'use strict';

// Drives environment-specific config via TEST_ENV=dev|qa|prod
// Defaults to 'qa' so CI and local runs are consistent without extra setup
const ENV = process.env.TEST_ENV || 'qa';

const environments = {
  dev: {
    uiBaseUrl: 'https://demoqa.com',
    apiBaseUrl: 'https://reqres.in/api/collections/testapi-utkarsh/records',
  },
  qa: {
    uiBaseUrl: 'https://demoqa.com',
    apiBaseUrl: 'https://reqres.in/api/collections/testapi-utkarsh/records',
  },
  prod: {
    uiBaseUrl: 'https://demoqa.com',
    apiBaseUrl: 'https://reqres.in/api/collections/testapi-utkarsh/records',
  },
};

if (!environments[ENV]) {
  throw new Error(`Unknown TEST_ENV="${ENV}". Valid values: dev, qa, prod`);
}

const { uiBaseUrl, apiBaseUrl } = environments[ENV];

module.exports = { env: ENV, uiBaseUrl, apiBaseUrl };
