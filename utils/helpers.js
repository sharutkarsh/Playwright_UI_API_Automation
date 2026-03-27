'use strict';

const fs = require('fs');
const path = require('path');

function writeResults(data, filename = 'results.txt') {
  const filePath = path.join(process.cwd(), 'results', filename);
  const content = Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  fs.writeFileSync(filePath, content + '\n', { flag: 'a' });
  console.log(`Results written to ${filePath}`);
}

module.exports = { writeResults };
