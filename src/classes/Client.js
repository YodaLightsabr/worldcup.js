const api = require('../api.js');

const GroupManager = require('./GroupManager.js');
const MatchManager = require('./MatchManager.js');
const TeamManager = require('./TeamManager.js');

class Client {
    constructor (baseEndpoint = "https://worldcupjson.net") {
        this.baseEndpoint = baseEndpoint;

        this.groups = new GroupManager(this);
        this.matches = new MatchManager(this);
        this.teams = new TeamManager(this);
    }

    get api () {
        return api(this.baseEndpoint);
    }
}

module.exports = Client;