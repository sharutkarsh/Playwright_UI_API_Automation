'use strict';

const { test: base } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const BooksStorePage = require('../pages/BooksStorePage');
const ApiClient = require('../utils/apiClient');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  booksStorePage: async ({ page }, use) => {
    await use(new BooksStorePage(page));
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

module.exports = { test };
