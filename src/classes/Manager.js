const { isIdResolvable } = require('../utils.js');
const Subscription = require('./Subscription.js');

class Manager {
    constructor (client, endpoint, DataClass) {
        this.client = client;
        this.endpoint = endpoint;
        this._DataClass = DataClass;
    }

    static _isResolvable (id, type) {
        return isIdResolvable(id, type);
    }

    subscribe (interval, fetchOptions) {
        const subscription = new Subscription(this.client, this.constructor, interval, fetchOptions);
        subscription.start();
        return subscription;
    }
}

module.exports = Manager;