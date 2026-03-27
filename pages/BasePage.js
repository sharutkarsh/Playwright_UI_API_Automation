'use strict';

const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // ================= ACTIONS =================

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async click(locator) {
    await expect(locator, 'Should verify element is visible before clicking').toBeVisible();
    await locator.click();
  }

  async fill(locator, value) {
    await expect(locator, 'Should verify element is visible before filling').toBeVisible();
    await locator.fill(value);
  }

  async getText(locator) {
    await expect(locator, 'Should verify element is visible before reading text').toBeVisible();
    return locator.innerText();
  }

  // ================= ASSERTIONS =================

  async isVisible(locator) {
    await expect(locator, 'Should verify element is visible').toBeVisible();
  }
}

module.exports = BasePage;
