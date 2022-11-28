const BaseData = require('./BaseData.js');
const Team = require('./Team.js');
const MatchTeam = require('./MatchTeam.js');
const MatchWeather = require('./MatchWeather.js');
const MatchTime = require('./MatchTime.js');
const { parseId } = require('../utils.js');

const transformations = {
    number: 'id',
    venue: 'venue',
    status: 'status',
    attendance: 'attendance',
    stageName: 'stage_name',
    timestamp: 'datetime',
    lastUpdated: 'last_checked_at',
    lastChanged: 'last_changed_at',
};

class Match extends BaseData {
    #raw;

    constructor (client, apiMatch) {
        super(client, apiMatch, transformations);

        if (apiMatch instanceof Match) return apiMatch;

        this.timestamp = new Date(this.timestamp);
        if (this.lastUpdated) this.lastUpdated = new Date(this.lastUpdated);
        if (this.lastChanged) this.lastChanged = new Date(this.lastChanged);
        
        if (typeof apiMatch.home_team == 'string') {
            this.homeTeamId = 'team_' + apiMatch.home_team;
            this.homeTeamCountry = apiMatch.home_team;
        }
        else if (apiMatch.home_team) {
            this.homeTeam = new MatchTeam(client, apiMatch.home_team, { match: this }, { statistics: apiMatch.home_team_statistics, lineup: apiMatch.home_team_lineup });
            this.homeTeamId = 'team_' + apiMatch.home_team.country;
            this.homeTeamCountry = apiMatch.home_team.country;
        }

        if (typeof apiMatch.away_team == 'string') {
            this.awayTeamId = 'team_' + apiMatch.away_team;
            this.awayTeamCountry = apiMatch.away_team;
        }
        else if (apiMatch.away_team) {
            this.awayTeam = new MatchTeam(client, apiMatch.away_team, { match: this }, { statistics: apiMatch.away_team_statistics, lineup: apiMatch.away_team_lineup });
            this.awayTeamId = 'team_' + apiMatch.away_team.country;
            this.awayTeamCountry = apiMatch.away_team.country;
        }

        if (apiMatch.weather) this.weather = new MatchWeather(client, apiMatch.weather, { match: this });
        if (apiMatch.detailed_time) this.detailedTime = new MatchTime(client, apiMatch.detailed_time, { match: this });

        if (this.homeTeam && this.awayTeam) this.teams = [ this.homeTeam, this.awayTeam ];

        this.#raw = apiMatch;
        this.id = `match_${this.number}`;
    }

    static async fetch (id, client) {
        const data = await client.api.matches[parseId(id)].get();
        return new Match(client, data);
    }

    async fetch (id) {
        const data = new Match(this.client, await this.client.api.matches[parseId(id ?? this.id)].get());

        for (const item in data) {
            this[item] = data[item];
        }

        return this;
    }

    static transformations () {
        return transformations;
    }
}

module.exports = Match;
