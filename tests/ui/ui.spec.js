'use strict';

const { test } = require('../../fixtures/testFixture');
const { testData } = require('../../config/testData');
const { writeResults } = require('../../utils/helpers');

const { username, password, searchTitle } = testData.ui;

test.describe('UI: DemoQA Book Store Flow', () => {

  test('Full book store flow: login → search → log book → logout @UI', async ({ page, loginPage, booksStorePage }) => {

    await test.step('Navigate to Books Store Application', async () => {
      await loginPage.goto();
    });

    await test.step(`Login as "${username}"`, async () => {
      await loginPage.login(username, password);
    });

    await test.step('Validate username and logout button are visible', async () => {
      await loginPage.assertUsernameVisible(username);
    });

    await test.step('Navigate to Book Store via home page button', async () => {
      await booksStorePage.gotoViaButton();
    });

    await test.step(`Search for book "${searchTitle}"`, async () => {
      await booksStorePage.searchBook(searchTitle);
    });

    await test.step('Validate book appears in search results', async () => {
      await booksStorePage.assertBookExists(searchTitle);
    });

    let bookDetails;
    await test.step('Extract book details and write to results file', async () => {
      bookDetails = await booksStorePage.getBookDetails(searchTitle);
      writeResults({
        Title: bookDetails.title,
        Author: bookDetails.author,
        Publisher: bookDetails.publisher,
        Timestamp: new Date().toISOString(),
      });
    });

    await test.step('Navigate back and logout', async () => {
      await page.goBack();
      await loginPage.logout();
    });
  });
});
