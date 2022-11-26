const worldcup = require('../src/index.js');

const client = worldcup();

async function main () {
    for (let i = 0; i < 10; i++) {
        await worldcup.utils.sleep(1000);
        await client.matches.fetch({ dateRange: 'current' }).then(() => console.log('Request completed'));
    }
}

main();