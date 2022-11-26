const worldcup = require('../src/index.js');

const client = worldcup();

// client.matches.fetch({ dateRange: 'today' }).then(console.log);


async function main () {
    console.log(await client.matches.fetch());

    await client.matches.fetch();

}

main();