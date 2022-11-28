const BaseData = require('./BaseData.js');

const transformations = {
    currentTime: "current_time",
    firstHalfTime: "first_half_time",
    firstHalfExtraTime: "first_half_extra_time",
    secondHalfTime: "second_half_time",
    secondHalfExtraTime: "second_half_extra_time"
};

class MatchTime extends BaseData {
    #raw;

    constructor (client, apiMatchTime, { match } = {}) {
        super(client, apiMatchTime, transformations);

        if (apiMatchTime instanceof MatchTime) return apiMatchTime;

        this.match = match;
        if (!this.match) throw new DataError('MatchTime must be constructed with a Match');

        if (this.currentTime?.endsWith && this.currentTime.endsWith('\'')) this.minutes = +this.currentTime.substring(0, this.currentTime.length - 1);

        this.#raw = apiMatchTime;
        this.id = `time_${this.match.number}`;
    }
}

module.exports = MatchTime;
