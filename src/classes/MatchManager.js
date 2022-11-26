const Match = require('./Match.js');
const Manager = require('./Manager.js');

class MatchManager extends Manager {
    constructor (client) {
        super(client, client.api.matches.get, Match);
    }

    _transform (rawMatch) {
        return new this._DataClass(this.client, rawMatch);
    }

    async get (id) {
        if (id) return await Match.get(id, this.client);
        const matches = await this.client.api.matches.get();
        return matches.map(this._transform.bind(this));
    }
}

module.exports = MatchManager;