const worldcup = require('../src/index.js');

const client = new worldcup.Client();

const matches = client.matches.fetch({ dateRange: 'current' });

matches.then(console.log);