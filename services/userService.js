'use strict';

const { testData } = require('../config/testData');

const { newUser } = testData.api;

/**
 * UserService encapsulates all user-related API operations.
 *
 * Placing setup logic here (rather than in test files) means:
 * - Tests stay focused on assertions, not plumbing
 * - Setup can be reused across multiple test suites
 * - Swapping the backend only requires changes in one place
 */
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Creates a user via API and returns { userId, name, job }.
   * Using API for setup avoids UI dependency and is significantly faster.
   */
  async createTestUser(name = newUser.name, job = newUser.job) {
    const res = await this.apiClient.createUser(name, job);
    if (res.status !== testData.api.expectedStatus.created) {
      throw new Error(`Failed to create test user: HTTP ${res.status}`);
    }
    return {
      userId: res.body.data.id,
      name,
      job,
    };
  }
}

module.exports = UserService;
