const Match = require('./Match.js');
const Manager = require('./Manager.js');
const { parseId } = require('../utils.js');

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

    async getToday () {
        const matches = await this.client.api.matches.today.get();
        return matches.map(this._transform.bind(this));
    }

    async getYesterday () {
        const matches = await this.client.api.matches.yesterday.get();
        return matches.map(this._transform.bind(this));
    }

    async getCurrent () {
        const matches = await this.client.api.matches.current.get();
        return matches.map(this._transform.bind(this));
    }

    async _getByTeam (team) {
        const matches = await this.client.api.matches.country.searchParams({ fifa_code: team.startsWith('team_') ? parseId(team) : team }).get();
        console.log(matches);
        return matches.map(this._transform.bind(this));
    }
}

module.exports = MatchManager;