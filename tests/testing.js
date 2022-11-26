const worldcup = require('../src/index.js');

const client = worldcup();

client.teams.fetch('team_USA').then(console.log);