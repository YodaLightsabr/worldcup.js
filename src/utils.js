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

class RateLimitController {
    constructor (requestsPer, unitOfTimeInSeconds) {
        this.per = requestsPer;
        this.seconds = unitOfTimeInSeconds;
    }

    get perSecond () {
        return this.per / this.seconds;
    }

    get perMinute () {
        return this.perSecond * 60;
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


module.exports = {
    parseId: (id) => id.substring(id.indexOf('_') + 1),
    isIdResolvable: (id, type) => typeof id == 'string' && id.startsWith(type + '_'),
    formatDate,
    DataError,
    APIError
};