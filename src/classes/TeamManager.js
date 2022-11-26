const Team = require('./Team.js');
const Manager = require('./Manager.js');
const Collection = require('./Collection.js');

class TeamManager extends Manager {
    constructor (client) {
        super(client, client.api.teams.get, Team);
    }

    get cache () {
        return this.client.cache.teams;
    }

    _transform (rawMatch) {
        const transformed = new this._DataClass(this.client, rawMatch);
        if (transformed.id && this?.client?.cache?.teams?.set) {
            if (this.client.cache.teams.has(transformed.id)) {
                const cached = this.client.cache.teams.get(transformed.id);
                const updated = Object.assign(cached, transformed);
                this.client.cache.teams.set(transformed.id, updated);
            } else {
                this.client.cache.teams.set(transformed.id, transformed);
            }
        }
        return transformed;
    }

    async fetch (id) {
        if (id) return await Team.fetch(id, this.client);
        const teams = await this.client.api.teams.get();
        for (const team of teams) {
            this.client.cache.teams.set(team.id, team);
        }
        return Collection.fromArray(teams.map(this._transform.bind(this)));
    }
}

module.exports = TeamManager;