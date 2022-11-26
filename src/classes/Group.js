const BaseData = require('./BaseData.js');
const Team = require('./Team.js');

class Group extends BaseData {
    #raw;

    constructor (client, apiGroup) {
        super(client, apiGroup);

        if (apiGroup instanceof Group) return apiGroup;

        this.letter = apiGroup.letter;

        this.teams = apiGroup.teams.map(team => new Team(client, team, { group: this }));

        this.#raw = apiGroup;
        this.id = `group_${this.letter}`;
    }
}

module.exports = Group;