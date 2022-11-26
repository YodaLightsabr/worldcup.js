const api = require('../api.js');

const GroupManager = require('./GroupManager.js');
const MatchManager = require('./MatchManager.js');
const TeamManager = require('./TeamManager.js');
const cacheUtil = require('../cache.js');

const { RateLimiter } = require('limiter');

class Client {
    constructor (baseEndpoint = "https://worldcupjson.net") {
        this.baseEndpoint = baseEndpoint;

        this.groups = new GroupManager(this);
        this.matches = new MatchManager(this);
        this.teams = new TeamManager(this);

        this.cache = cacheUtil();

        this.limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1000 * 30 });
    }

    async rateLimitHandler () {
        return await this.limiter.removeTokens(1);
    }

    get api () {
        return api(this.baseEndpoint, this.rateLimitHandler.bind(this));
    }
}

module.exports = Client;