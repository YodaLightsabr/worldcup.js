const Group = require('./Group.js');
const Manager = require('./Manager.js');

class GroupManager extends Manager {
    constructor (client) {
        super(client, client.api.teams.get, Group);
    }

    _transform (rawGroup) {
        return new this._DataClass(this.client, rawGroup);
    }

    async get (id) {
        const { groups } = await this.client.api.teams.get();
        return groups.map(this._transform.bind(this));
    }
}

module.exports = GroupManager;