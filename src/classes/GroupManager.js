const Collection = require('./Collection.js');
const Group = require('./Group.js');
const Manager = require('./Manager.js');

class GroupManager extends Manager {
    constructor (client) {
        super(client, client.api.teams.get, Group);
    }

    /**
     * Get cached groups
     */
    get cache () {
        return this.client.cache.groups;
    }

    _transform (rawGroup) {
        const transformed = new this._DataClass(this.client, rawGroup);
        if (transformed.id && this?.client?.cache?.groups?.set) {
            if (this.client.cache.groups.has(transformed.id)) {
                const cached = this.client.cache.groups.get(transformed.id);
                const updated = Object.assign(cached, transformed);
                this.client.cache.groups.set(transformed.id, updated);
            } else {
                this.client.cache.groups.set(transformed.id, transformed);
            }
        }
        return transformed;
    }

    /**
     * Fetch all groups, cache the response, and return it
     * @returns {Collection<string, Group>}
     */
    async fetch () {
        const { groups } = await this.client.api.teams.get();
        return Collection.fromArray(groups.map(this._transform.bind(this)));
    }
}

module.exports = GroupManager;