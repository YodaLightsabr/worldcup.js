const worldcup = require('../src/index.js');

const client = worldcup();

const matches = client.matches.fetch({ dateRange: 'current' });

matches.then(console.log);