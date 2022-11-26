const Client = require('./classes/Client.js');

const items = {
    Client,
    Group: require('./classes/Group.js'),
    GroupManager: require('./classes/GroupManager.js'),
    Match: require('./classes/Match.js'),
    MatchManager: require('./classes/MatchManager.js'),
    Team: require('./classes/Team.js'),
    TeamManager: require('./classes/TeamManager.js'),
    MatchTeam: require('./classes/MatchTeam.js'),
    MatchTime: require('./classes/MatchTime.js'),
    MatchWeather: require('./classes/MatchWeather.js'),
    cacheUtil: require('./cache.js'),
    Collection: require('./classes/Collection.js'),
    Manager: require('./classes/Manager')
}

module.exports = (baseEndpoint) => new Client(baseEndpoint);

for (const item in items) {
    module.exports[item] = items[item];
}