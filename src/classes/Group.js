const BaseData = require('./BaseData.js');
const Collection = require('./Collection.js');
const Team = require('./Team.js');

class Group extends BaseData {
    #raw;

    constructor (client, apiGroup) {
        super(client, apiGroup);

        if (apiGroup instanceof Group) return apiGroup;

        /**
         * The letter/name of the group
         */
        this.letter = apiGroup.letter;

        /**
         * The teams in the group as a collection
         */
        this.teams = Collection.fromArray(apiGroup.teams.map(team => new Team(client, team, { group: this })));

        this.#raw = apiGroup;

        /**
         * The unique ID of the group
         */
        this.id = `group_${this.letter}`;
    }
}

module.exports = Group;