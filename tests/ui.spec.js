'use strict';

const { expect } = require('@playwright/test');
const { test } = require('../fixtures/testFixture');
const { testData } = require('../config/testData');
const { writeResults } = require('../utils/helpers');

const { username, password, searchTitle } = testData.ui;

test.describe('UI: DemoQA Book Store Flow', () => {

  test('Full book store flow: login → search → log book → logout @UI', async ({ page, loginPage, booksStorePage }) => {

    await test.step('Step 1: Navigate to Books Store Application', async () => {
      await loginPage.goto();
    });

    await test.step(`Step 2: Login using the newly created user "${username}"`, async () => {
      await loginPage.login(username, password);
    });

    await test.step('Step 3: Upon successful login, Validate username and logout button.', async () => {
      await loginPage.assertUsernameVisible(username);
    });

    await test.step('Step 4: Click on bookstore button', async () => {
      await booksStorePage.gotoViaButton();
    });

    await test.step(`Step 5: Search for book "${searchTitle}"`, async () => {
      await booksStorePage.searchBook(searchTitle);
    });

    await test.step('Step 6: Validate the search result to contain this book.', async () => {
      await booksStorePage.assertBookExists(searchTitle);
    });

    let bookDetails;
    await test.step('Step 7: Print Title, Author and Publisher into a file.', async () => {
      bookDetails = await booksStorePage.getBookDetails(searchTitle);
      writeResults({
        Title: bookDetails.title,
        Author: bookDetails.author,
        Publisher: bookDetails.publisher,
        Timestamp: new Date().toISOString(),
      });
    });

    await test.step('Step 8: Click on log out', async () => {
      await page.goBack();
      await loginPage.goto();
      await loginPage.logout();
    });
  });
});
