'use strict';

const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/testFixture');
const { testData } = require('../../config/testData');

const { updatedUser, expectedStatus } = testData.api;

test.describe.configure({ mode: 'serial' }); // Tests share state via process.env — serial ensures correct ordering

test.describe('API: reqres.in User CRUD Flow', () => {

  test('POST /api/users → Create user via UserService, validate 201 and store userId @API', async ({ userService }) => {
    // Using UserService (API layer) for setup keeps test intent clear:
    // this test validates the creation contract, not the HTTP mechanics
    let createdUser;
    await test.step('Create user via UserService', async () => {
      createdUser = await userService.createTestUser();
    });

    await test.step('Validate response contains id', async () => {
      expect(createdUser.userId, 'Should verify created user has an id').toBeTruthy();
    });

    await test.step('Validate response contains correct name and job', async () => {
      expect(createdUser.name, 'Should verify name matches').toBe(testData.api.newUser.name);
      expect(createdUser.job, 'Should verify job matches').toBe(testData.api.newUser.job);
    });

    await test.step('Store created userId for subsequent tests', async () => {
      process.env.CREATED_USER_ID = createdUser.userId;
    });
  });

  test('GET /api/users/{id} → Fetch created user and validate details @API', async ({ apiClient }) => {
    const id = process.env.CREATED_USER_ID;

    let status, body;
    await test.step(`Send GET /api/users/${id}`, async () => {
      const res = await apiClient.getUser(id);
      status = res.status;
      body = res.body;
    });

    await test.step('Validate response status is 200', async () => {
      expect(status, 'Should verify GET /api/users returns 200 OK').toBe(expectedStatus.ok);
    });

    await test.step('Validate fetched user name and job match created user', async () => {
      expect(body.data.data.name, 'Should verify fetched name matches').toBe(testData.api.newUser.name);
      expect(body.data.data.job, 'Should verify fetched job matches').toBe(testData.api.newUser.job);
    });
  });

  test('PUT /api/users/{id} → Update user name and validate @API', async ({ apiClient }) => {
    const id = process.env.CREATED_USER_ID;

    let body;
    await test.step(`Send PUT /api/users/${id} with updated payload`, async () => {
      const res = await apiClient.updateUser(id, updatedUser.name, updatedUser.job);
      body = res.body;
      expect(res.status, 'Should verify PUT /api/users returns 200 OK').toBe(expectedStatus.ok);
    });

    await test.step('Validate updated name in response', async () => {
      expect(body.data.data.name, 'Should verify updated name matches').toBe(updatedUser.name);
    });

    await test.step('Validate updated job in response', async () => {
      expect(body.data.data.job, 'Should verify updated job matches').toBe(updatedUser.job);
    });

    await test.step('Validate updatedAt timestamp is present', async () => {
      expect(body.data, 'Should verify response contains updatedAt timestamp').toHaveProperty('updated_at');
    });
  });
});
