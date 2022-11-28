const BaseData = require('./BaseData.js');
const { snakeToCamelCase } = require('../utils.js');

const transformations = {
    type: "type_of_event",
    player: "player",
    time: "time",
    number: "id"
};

class MatchEvent extends BaseData {
    #raw;

    constructor (client, apiMatchEvent, { match, team } = {}) {
        console.log(apiMatchEvent);
        super(client, apiMatchEvent, transformations);

        if (apiMatchEvent instanceof MatchEvent) return apiMatchEvent;
        
        this.match = match;
        if (!this.match) throw new DataError('MatchEvent must be constructed with a Match');

        if (team) this.team = team;

        if (apiMatchEvent.extra_info) this.extraInfo = snakeToCamelCase(JSON.parse(apiMatchEvent.extra_info));

        this.#raw = apiMatchEvent;
        this.id = `event_${this.number}`;
    }
}

module.exports = MatchEvent;
