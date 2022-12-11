const worldcup = require('../src/index.js');

const client = new worldcup.Client();

const matches = client.matches.fetch({ detailed: true });

matches.then(console.log);