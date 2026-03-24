'use strict';

const testData = {
  ui: {
    baseUrl: 'https://demoqa.com',
    username: 'testuser_qa01',
    password: 'Test@1234!',
    searchTitle: 'Learning JavaScript Design Patterns',
  },
  api: {
    baseUrl: 'https://reqres.in/api/collections/testapi-utkarsh/records',
    apiKey: 'pro_9a810f24fcdbc61614292cfd250b90b2cf08bb6e2f428e1c',
    fallbackUserId: '1',
    expectedStatus: {
      created: 201,
      ok: 200,
    },
    newUser: {
      name: 'John Doe',
      job: 'QA Engineer',
    },
    updatedUser: {
      name: 'Jane Doe',
      job: 'Senior QA',
    },
  },
};

module.exports = { testData };
