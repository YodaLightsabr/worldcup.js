const Team = require('./Team.js');
const Manager = require('./Manager.js');

class TeamManager extends Manager {
    constructor (client) {
        super(client, client.api.teams.get, Team);
    }

    _transform (rawMatch) {
        return new this._DataClass(this.client, rawMatch);
    }

    async get (id) {
        if (id) return await Team.get(id, this.client);
        const teams = await this.client.api.teams.get();
        return teams.map(this._transform.bind(this));
    }
}

module.exports = TeamManager;