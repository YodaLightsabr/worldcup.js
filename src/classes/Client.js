const api = require('../api.js');

const GroupManager = require('./GroupManager.js');
const MatchManager = require('./MatchManager.js');
const TeamManager = require('./TeamManager.js');
const cacheUtil = require('../cache.js');

const { RateLimiter } = require('limiter');

class Client {
    /**
     * Instantiate the client
     * @param {string} baseEndpoint Base endpoint as URL. Defaults to worldcupjson.net
     */
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

    /**
     * Internal API wrapper
     */
    get api () {
        return api(this.baseEndpoint, this.rateLimitHandler.bind(this));
    }

    /**
     * Load API data into cache
     */
    async load () {
        await this.groups.fetch();
        await this.matches.fetch({ detailed: true });
        await this.teams.fetch();
    }
}

module.exports = Client;