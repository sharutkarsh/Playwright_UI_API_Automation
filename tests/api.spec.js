'use strict';

const { expect } = require('@playwright/test');
const { test } = require('../fixtures/testFixture');
const { testData } = require('../config/testData');

const { newUser, updatedUser, expectedStatus } = testData.api;

test.describe.configure({mode: 'serial'}); // Ensure tests run in order since they depend on each other

test.describe('API: reqres.in User CRUD Flow', () => {

  test('POST /api/users → Create user, validate 201 and store userId @API', async ({ apiClient }) => {

    let body;
    await test.step(`Step 1: Send POST /api/users with name="${newUser.name}", job="${newUser.job}"`, async () => {
      const res = await apiClient.createUser(newUser.name, newUser.job);
      body = res.body;
      expect(res.status, 'Should verify POST /api/users returns 201 Created').toBe(expectedStatus.created);
    });

    await test.step('Step 2: Validate response contains id', async () => {
      expect(body.data, 'Should verify response contains data object').toHaveProperty('id');
    });

    await test.step('Step 3: Validate response contains correct name and job', async () => {
      expect(body.data.data.name, `Should verify response name matches "${newUser.name}"`).toBe(newUser.name);
      expect(body.data.data.job, `Should verify response job matches "${newUser.job}"`).toBe(newUser.job);
    });

    await test.step('Step 4: Store created userId for subsequent tests', async () => {
      process.env.CREATED_USER_ID = body.data.id;
    });
  });

  test('GET /api/users/{id} → Fetch created user and validate details @API', async ({ apiClient }) => {
    const id = process.env.CREATED_USER_ID;

    let status, body;
    await test.step(`Step 1: Send GET /api/users/${id}`, async () => {
      const res = await apiClient.getUser(id);
      status = res.status;
      body = res.body;
    });

    await test.step('Step 2: Validate response status is 200', async () => {
      expect(status, 'Should verify GET /api/users returns 200 OK').toBe(expectedStatus.ok);
    });

    await test.step('Step 3: Validate fetched user name and job match created user', async () => {
      expect(body.data.data.name, `Should verify fetched name matches "${newUser.name}"`).toBe(newUser.name);
      expect(body.data.data.job, `Should verify fetched job matches "${newUser.job}"`).toBe(newUser.job);
    });
  });

  test('PUT /api/users/{id} → Update user name and validate @API', async ({ apiClient }) => {
    const id = process.env.CREATED_USER_ID;

    let body;
    await test.step(`Step 1: Send PUT /api/users/${id} with name="${updatedUser.name}", job="${updatedUser.job}"`, async () => {
      const res = await apiClient.updateUser(id, updatedUser.name, updatedUser.job);
      body = res.body;
      expect(res.status, 'Should verify PUT /api/users returns 200 OK').toBe(expectedStatus.ok);
    });

    await test.step('Step 2: Validate updated name in response', async () => {
      expect(body.data.data.name, `Should verify updated name matches "${updatedUser.name}"`).toBe(updatedUser.name);
    });

    await test.step('Step 3: Validate updated job in response', async () => {
      expect(body.data.data.job, `Should verify updated job matches "${updatedUser.job}"`).toBe(updatedUser.job);
    });

    await test.step('Step 4: Validate updatedAt timestamp is present', async () => {
      expect(body.data, 'Should verify response contains updatedAt timestamp').toHaveProperty('updated_at');
    });
  });
});
