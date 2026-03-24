'use strict';

const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // ================= LOCATORS =================
    this.usernameInput = page.locator('//input[@id="userName"]');
    this.passwordInput = page.locator('//input[@id="password"]');
    this.loginButton   = page.locator('//button[@id="login"]');
    this.logoutButton  = page.locator('//button[@id="submit" and contains(text(),"out")]');
    this.userNameLabel = page.locator('//label[@id="userName-value"]');
  }

  // ================= ACTIONS =================

  async goto() {
    await this.navigate('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.page.waitForURL('**/profile', { timeout: 15000 });
  }

  async getLoggedInUsername() {
    return this.getText(this.userNameLabel);
  }

  async logout() {
    await this.click(this.logoutButton);
    await this.page.waitForURL('**/login', { timeout: 10000 });
  }

  // ================= ASSERTIONS =================

  async assertUsernameVisible(expectedUsername) {
    await expect(this.userNameLabel, 'Should verify username label is visible').toBeVisible();
    await expect(this.userNameLabel, `Should verify username matches "${expectedUsername}"`).toHaveText(expectedUsername);
    await expect(this.logoutButton, 'Should verify logout button is visible').toBeVisible();
  }
}

module.exports = LoginPage;
