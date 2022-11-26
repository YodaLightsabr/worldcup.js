const { Client } = require('../src/index.js');

const client = new Client();

client.teams.get('team_USA').then(async team => {
    await team.get();
    await team.lastMatch.get();
    console.log(team.lastMatch);
});