'use strict';

const { test: base } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const BooksStorePage = require('../pages/BooksStorePage');
const ApiClient = require('../utils/apiClient');
const UserService = require('../services/userService');

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

  // userService is wired here so any test can use API-based setup
  // without importing service classes directly in test files
  userService: async ({ request }, use) => {
    await use(new UserService(new ApiClient(request)));
  },
});

module.exports = { test };
