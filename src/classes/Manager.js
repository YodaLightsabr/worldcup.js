class Manager {
    constructor (client, endpoint, DataClass) {
        this.client = client;
        this.endpoint = endpoint;
        this._DataClass = DataClass;
    }

    async get () {

    }
}

module.exports = Manager;