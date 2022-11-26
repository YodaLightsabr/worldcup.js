const BaseData = require('./BaseData.js');
const Group = require('./Group.js');
const { parseId } = require('../utils.js');

const transformations = {
    country: 'country',
    name: 'name',
    groupPoints: 'group_points',
    wins: 'wins',
    draws: 'draws',
    losses: 'losses',
    goalsFor: 'goals_for',
    goalsAgainst: 'goals_against',
    goalDifferential: 'goal_differential'
};

class Team extends BaseData {
    #raw;

    constructor (client, apiTeam, { group } = {}) {
        super(client, apiTeam, transformations);

        const Match = require('./Match.js');

        if (apiTeam instanceof Team) return apiTeam;

        if (group) this.group = group;
        if (apiTeam.last_match) this.lastMatch = new Match(client, apiTeam.last_match);
        if (apiTeam.next_match) this.nextMatch = new Match(client, apiTeam.next_match);

        this.#raw = apiTeam;
        this.id = `team_${this.country}`;
    }

    static async get (id, client) {
        return new Team(client, await client.api.teams[parseId(id)].get());
    }

    async get (id) {
        const data = new Team(this.client, await this.client.api.teams[parseId(id ?? this.id)].get());

        for (const item in data) {
            this[item] = data[item];
        }

        return this;
    }

    static transformations () {
        return transformations;
    }
}

module.exports = Team;