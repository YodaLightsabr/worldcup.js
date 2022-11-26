const { Client, Collection, Manager } = require('../src/index.js');

const client = new Client();

// client.matches.fetch({ dateRange: 'today' }).then(console.log);


async function main () {
    await client.matches.fetch({ detailed: false, dateRange: 'current' });

    console.log(client.matches.cache);
    await client.matches.fetch({ detailed: true, dateRange: 'current' });

    console.log(client.matches.cache);
}

main();