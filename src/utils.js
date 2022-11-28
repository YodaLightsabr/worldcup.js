class DataError extends Error {
    constructor (message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class APIError extends Error {
    constructor (message) {
        super(message);
        this.name = this.constructor.name;
    }
}

function formatDate (date) {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function snakeToCamelCase (snakeCaseObject) {
    const output = {};
    for (const key in snakeCaseObject) {
        const segments = key.split('_');
        let newKey = '';
        for (const segment of segments) {
            const chars = segment.split('');
            newKey += [ chars.shift().toUpperCase(), ...chars ].join('');
        }
        output[newKey[0].toLowerCase() + newKey.substring(1)] = snakeCaseObject[key];
    }
    return output;
}

module.exports = {
    parseId: (id) => id.substring(id.indexOf('_') + 1),
    isIdResolvable: (id, type) => typeof id == 'string' && id.startsWith(type + '_'),
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    formatDate,
    DataError,
    APIError,
    snakeToCamelCase
};