const Match = require('./Match.js');
const Manager = require('./Manager.js');
const { parseId, formatDate } = require('../utils.js');
const Team = require('./Team.js');
const Collection = require('./Collection.js');

class MatchManager extends Manager {
    constructor (client) {
        super(client, client.api.matches.get, Match);
    }

    get cache () {
        return this.client.cache.matches;
    }

    _transform (rawMatch) {
        const transformed = new this._DataClass(this.client, rawMatch);
        if (transformed.id && this?.client?.cache?.matches?.set) {
            if (this.client.cache.matches.has(transformed.id)) {
                const cached = this.client.cache.matches.get(transformed.id);
                const updated = Object.assign(cached, transformed);
                this.client.cache.matches.set(transformed.id, updated);
            } else {
                this.client.cache.matches.set(transformed.id, transformed);
            }
        }
        return transformed;
    }

    async fetch (config) {
        if (Manager._isResolvable(config, 'match')) {
            return await Match.fetch(config, this.client);
        }

        const searchParams = {};
        if (typeof config === 'object') {
            if (config.detailed) searchParams.details = 'true';
            else if (config.detailed === false) searchParams.details = 'false';

            if (typeof config.sort === 'string') {
                if (config.sort.toLowerCase() === 'date') searchParams.by_date = 'asc';
                else if (config.sort.toLowerCase() === 'dateAscending') searchParams.by_date = 'asc';
                else if (config.sort.toLowerCase() === 'dateDescending') searchParams.by_date = 'asc';

                else if (config.sort.toLowerCase() === 'totalGoals') searchParams.by = 'total_goals';
                else if (config.sort.toLowerCase() === 'homeTeamGoals') searchParams.by = 'home_team_goals';
                else if (config.sort.toLowerCase() === 'awayTeamGoals') searchParams.by = 'away_team_goals';
                else if (config.sort.toLowerCase() === 'closestScores') searchParams.by = 'closes_scores';

                else searchParams.by = config.sort;
            }

            if (config.byDate?.toLowerCase && config.byDate?.toLowerCase() === 'ascending') searchParams.by_date = 'asc';
            else if (config.byDate?.toLowerCase && config.byDate?.toLowerCase() === 'descending') searchParams.by_date = 'desc';

            if (config.dateRange?.toLowerCase && config.dateRange?.toLowerCase() === 'today') {
                return await this._fetchToday(searchParams);
            } else if (config.dateRange?.toLowerCase && config.dateRange?.toLowerCase() === 'yesterday') {
                return await this._fetchYesterday(searchParams);
            } else if (config.dateRange?.toLowerCase && config.dateRange?.toLowerCase() === 'current') {
                return await this._fetchCurrent(searchParams);
            } else if (config.dateRange instanceof Array) {
                const [start, end] = config.dateRange;
                if (start) searchParams.start = formatDate(start);
                if (end) searchParams.end = formatDate(end);
            }

            if (config.team instanceof Team || Manager._isResolvable(config.team, 'team')) {
                return await this._fetchByTeam(config.team, searchParams);
            }
        }
        const matches = await this.client.api.matches.get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
    }

    async _fetchToday (searchParams) {
        const matches = await this.client.api.matches.today.searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
    }

    async _fetchYesterday (searchParams) {
        const matches = await this.client.api.matches.yesterday.searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
    }

    async _fetchCurrent (searchParams) {
        const matches = await this.client.api.matches.current.searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
    }

    async _fetchByTeam (team, searchParams) {
        const matches = await this.client.api.matches.country[team instanceof Team ? parseId(team.id) : team.startsWith('team_') ? parseId(team) : team].searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
    }
}

module.exports = MatchManager;