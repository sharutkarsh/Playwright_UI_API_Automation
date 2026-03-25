'use strict';

const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

const MODEL_ID = 'anthropic.claude-3-5-sonnet-20240620-v1:0';

/**
 * Send a prompt to Claude via Amazon Bedrock and return the text response.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function askClaude(prompt) {
  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);
  const result = JSON.parse(Buffer.from(response.body).toString('utf8'));
  return result.content[0].text.trim();
}

module.exports = { askClaude };
