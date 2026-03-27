'use strict';

const { testData } = require('../config/testData');

const BASE_URL = testData.api.baseUrl;
const HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': testData.api.apiKey,
};

class ApiClient {
  constructor(request) {
    this.request = request;
  }

  async createUser(name, job) {
    const response = await this.request.post(BASE_URL, {
      data: { data: { name, job } },
      headers: HEADERS,
    });
    return { status: response.status(), body: await response.json() };
  }

  async getUser(id) {
    const response = await this.request.get(`${BASE_URL}/${id}`, {
      headers: HEADERS,
    });
    return { status: response.status(), body: await response.json() };
  }

  async updateUser(id, name, job) {
    const response = await this.request.put(`${BASE_URL}/${id}`, {
      data: { data: { name, job } },
      headers: HEADERS,
    });
    return { status: response.status(), body: await response.json() };
  }
}

module.exports = ApiClient;
