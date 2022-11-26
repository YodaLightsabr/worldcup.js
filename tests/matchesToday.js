const worldcup = require('../src/index.js');

const client = worldcup();

// client.matches.fetch({ dateRange: 'today' }).then(console.log);


async function main () {
    await client.matches.fetch({ detailed: false, dateRange: 'current' });

    console.log(client.matches.cache);
    await client.matches.fetch({ detailed: true, dateRange: 'current' });

    console.log(client.matches.cache);
}

main();