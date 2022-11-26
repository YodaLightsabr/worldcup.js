const { Client } = require('../src/index.js');

const client = new Client();

client.matches.getToday().then(matches => {
    console.log(matches);
});