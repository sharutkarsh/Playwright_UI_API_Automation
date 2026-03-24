'use strict';

const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class BooksStorePage extends BasePage {
  constructor(page) {
    super(page);

    // ================= LOCATORS =================
    this.bookStoreButton = page.locator('//div[@class="card-body"]//h5[text()="Book Store Application"]');
    this.searchInput     = page.locator('//input[@id="searchBox"]');
    this.bookRows        = page.locator('//table//tbody//tr');
    this.bookTitleLink   = (title) => page.locator(`//table//tbody//a[text()="${title}"]`);
    this.bookTitleValue  = page.locator('//div[@id="title-wrapper"]//label[@id="userName-value"]');
    this.authorValue     = page.locator('//div[@id="author-wrapper"]//label[@id="userName-value"]');
    this.publisherValue  = page.locator('//div[@id="publisher-wrapper"]//label[@id="userName-value"]');
  }

  // ================= ACTIONS =================

  async goto() {
    await this.navigate('/books');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaButton() {
    await this.navigate('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.click(this.bookStoreButton);
    await this.page.waitForURL('**/books', { timeout: 10000 });
  }

  async searchBook(title) {
    await this.fill(this.searchInput, title);
    await this.page.waitForTimeout(1000);
  }

  async getBookDetails(title) {
    await this.click(this.bookTitleLink(title));
    await this.page.waitForLoadState('domcontentloaded');

    const bookTitle  = await this.getText(this.bookTitleValue);
    const author     = await this.getText(this.authorValue);
    const publisher  = await this.getText(this.publisherValue);

    return { title: bookTitle, author, publisher };
  }

  // ================= ASSERTIONS =================

  async assertBookExists(title) {
    await expect(this.bookTitleLink(title), `Should verify book "${title}" exists in search results`).toBeVisible();
  }
}

module.exports = BooksStorePage;
