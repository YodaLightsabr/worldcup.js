const Match = require('./Group.js');
const Team = require('./Team.js');
const { DataError } = require('../utils.js');
const MatchEvent = require('./MatchEvent.js');
const Collection = require('./Collection.js');
const Player = require('./Player.js');

const statisticsTransformations = {
    country: "country",
    attemptsOnGoal: "attempts_on_goal",
    attemptsOnGoalAgainst: "attempts_on_goal_against",
    onTarget: "on_target",
    offTarget: "off_target",
    blocked: "blocked",
    corners: "corners",
    offsides: "offsides",
    passes: "num_passes",
    passesCompleted: "passes_completed",
    tackles: "tackles",
    freeKicks: "free_kicks",
    goalKicks: "goal_kicks",
    penalties: "penalties",
    penaltiesScored: "penalties_scored",
    throwIns: "throw_ins",
    yellowCards: "yellow_cards",
    redCards: "red_cards",
    foulsCommited: "fouls_committed"
};

class MatchTeam extends Team {
    #raw;

    constructor (client, apiMatchTeam, { match } = {}, { statistics, lineup, events } = {}) {
        super(client, apiMatchTeam);

        if (apiMatchTeam instanceof MatchTeam) return apiMatchTeam;

        this.match = match;
        if (!this.match) throw new DataError('MatchTeam must be constructed with a Match');

        if (apiMatchTeam.goals) this.goals = apiMatchTeam.goals;
        if (lineup?.tactics) this.lineupTactics = lineup.tactics;

        if (lineup && lineup.starting_eleven) this.startingLineup = Collection.fromArray(
            lineup.starting_eleven.map(player => 
                new Player(
                    client,
                    player,
                    { match },
                    { team: new Team(client, apiMatchTeam) }
                )
            )
        );

        if (lineup && lineup.substitutes) this.substitutes = Collection.fromArray(
            lineup.substitutes.map(player => 
                new Player(
                    client,
                    player,
                    { match },
                    { team: new Team(client, apiMatchTeam) }
                )
            )
        );

        if (events) this.events = Collection.fromArray(events.map(event => new MatchEvent(
            client,
            event,
            { match }
        )));

        if (statistics) this.statistics = MatchTeam.transform(statistics, statisticsTransformations);

        this.#raw = apiMatchTeam;
        this.id = `team_${this.country}`;
    }
}

module.exports = MatchTeam;