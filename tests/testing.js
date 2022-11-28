const worldcup = require('../src/index.js');

const client = worldcup();

client.matches.fetch({ dateRange: 'current' }).then(a => console.log(a.first().homeTeam.events));