const { isIdResolvable } = require('../utils.js');

class Manager {
    constructor (client, endpoint, DataClass) {
        this.client = client;
        this.endpoint = endpoint;
        this._DataClass = DataClass;
    }

    static _isResolvable (id, type) {
        return isIdResolvable(id, type);
    }
}

module.exports = Manager;