var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// src/classes/Collection.js
var require_Collection = __commonJS({
  "src/classes/Collection.js"(exports2, module2) {
    var Collection2 = class extends Map {
      constructor(iterable) {
        super(iterable);
      }
      toArray() {
        return [...this.values()];
      }
      first() {
        return [...this.values()][0];
      }
      last() {
        return [...this.values()][-1];
      }
      static fromObject(object) {
        return new Collection2(Object.entries(object));
      }
      static fromArray(array, indexable = "id") {
        const collection = new Collection2();
        for (const item of array) {
          if (item == null ? void 0 : item[indexable]) {
            collection.set(item[indexable], item);
          }
        }
        return collection;
      }
    };
    module2.exports = Collection2;
  }
});

// src/classes/BaseData.js
var require_BaseData = __commonJS({
  "src/classes/BaseData.js"(exports2, module2) {
    var BaseData = class {
      constructor(client, apiData, transformations) {
        this.client = client;
        const transformed = BaseData.transform(apiData, transformations);
        for (const key in transformed) {
          this[key] = transformed[key];
        }
      }
      static transform(apiData, transformations) {
        const output = {};
        for (const transformation in transformations) {
          if (apiData[transformations[transformation]]) {
            let transformed = apiData[transformations[transformation]];
            output[transformation] = transformed;
          }
        }
        return output;
      }
    };
    module2.exports = BaseData;
  }
});

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    var DataError2 = class extends Error {
      constructor(message) {
        super(message);
        this.name = this.constructor.name;
      }
    };
    var APIError = class extends Error {
      constructor(message) {
        super(message);
        this.name = this.constructor.name;
      }
    };
    function formatDate(date) {
      let d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      let year = d.getFullYear();
      if (month.length < 2)
        month = "0" + month;
      if (day.length < 2)
        day = "0" + day;
      return [year, month, day].join("-");
    }
    module2.exports = {
      parseId: (id) => id.substring(id.indexOf("_") + 1),
      isIdResolvable: (id, type) => typeof id == "string" && id.startsWith(type + "_"),
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      formatDate,
      DataError: DataError2,
      APIError
    };
  }
});

// src/classes/MatchTeam.js
var require_MatchTeam = __commonJS({
  "src/classes/MatchTeam.js"(exports2, module2) {
    var Match = require_Group();
    var Team = require_Team();
    var { DataError: DataError2 } = require_utils();
    var statisticsTransformations = {
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
    var _raw;
    var _MatchTeam = class extends Team {
      constructor(client, apiMatchTeam, { match } = {}, { statistics } = {}) {
        super(client, apiMatchTeam);
        __privateAdd(this, _raw, void 0);
        if (apiMatchTeam instanceof _MatchTeam)
          return apiMatchTeam;
        this.match = match;
        if (!this.match)
          throw new DataError2("MatchTeam must be constructed with a match");
        if (statistics)
          this.statistics = _MatchTeam.transform(statistics, statisticsTransformations);
        __privateSet(this, _raw, apiMatchTeam);
        this.id = `team_${this.country}`;
      }
    };
    var MatchTeam = _MatchTeam;
    _raw = new WeakMap();
    module2.exports = MatchTeam;
  }
});

// src/classes/MatchWeather.js
var require_MatchWeather = __commonJS({
  "src/classes/MatchWeather.js"(exports2, module2) {
    var BaseData = require_BaseData();
    var transformations = {
      humidity: "humidity",
      temperatureFarenheit: "temp_farenheit",
      temperatureCelsius: "temp_celsius",
      windSpeed: "wind_speed",
      description: "description"
    };
    var _raw;
    var _MatchWeather = class extends BaseData {
      constructor(client, apiMatchWeather, { match } = {}) {
        super(client, apiMatchWeather, transformations);
        __privateAdd(this, _raw, void 0);
        if (apiMatchWeather instanceof _MatchWeather)
          return apiMatchWeather;
        this.match = match;
        if (!this.match)
          throw new DataError("MatchWeather must be constructed with a match");
        __privateSet(this, _raw, apiMatchWeather);
        this.id = `weather_${this.match.number}`;
      }
    };
    var MatchWeather = _MatchWeather;
    _raw = new WeakMap();
    module2.exports = MatchWeather;
  }
});

// src/classes/MatchTime.js
var require_MatchTime = __commonJS({
  "src/classes/MatchTime.js"(exports2, module2) {
    var BaseData = require_BaseData();
    var transformations = {
      currentTime: "current_time",
      firstHalfTime: "first_half_time",
      firstHalfExtraTime: "first_half_extra_time",
      secondHalfTime: "second_half_time",
      secondHalfExtraTime: "second_half_extra_time"
    };
    var _raw;
    var _MatchTime = class extends BaseData {
      constructor(client, apiMatchTime, { match } = {}) {
        super(client, apiMatchTime, transformations);
        __privateAdd(this, _raw, void 0);
        if (apiMatchTime instanceof _MatchTime)
          return apiMatchTime;
        this.match = match;
        if (!this.match)
          throw new DataError("MatchTime must be constructed with a match");
        __privateSet(this, _raw, apiMatchTime);
        this.id = `time_${this.match.number}`;
      }
    };
    var MatchTime = _MatchTime;
    _raw = new WeakMap();
    module2.exports = MatchTime;
  }
});

// src/classes/Match.js
var require_Match = __commonJS({
  "src/classes/Match.js"(exports2, module2) {
    var BaseData = require_BaseData();
    var Team = require_Team();
    var MatchTeam = require_MatchTeam();
    var MatchWeather = require_MatchWeather();
    var MatchTime = require_MatchTime();
    var { parseId } = require_utils();
    var transformations = {
      number: "id",
      venue: "venue",
      status: "status",
      attendance: "attendance",
      stageName: "stage_name",
      timestamp: "datetime",
      lastUpdated: "last_checked_at",
      lastChanged: "last_changed_at"
    };
    var _raw;
    var _Match = class extends BaseData {
      constructor(client, apiMatch) {
        super(client, apiMatch, transformations);
        __privateAdd(this, _raw, void 0);
        if (apiMatch instanceof _Match)
          return apiMatch;
        this.timestamp = new Date(this.timestamp);
        if (this.lastUpdated)
          this.lastUpdated = new Date(this.lastUpdated);
        if (this.lastChanged)
          this.lastChanged = new Date(this.lastChanged);
        if (typeof apiMatch.home_team == "string") {
          this.homeTeamId = "team_" + apiMatch.home_team;
          this.homeTeamCountry = apiMatch.home_team;
        } else if (apiMatch.home_team) {
          this.homeTeam = new MatchTeam(client, apiMatch.home_team, { match: this }, { statistics: apiMatch.home_team_statistics });
          this.homeTeamId = "team_" + apiMatch.home_team.country;
          this.homeTeamCountry = apiMatch.home_team.country;
        }
        if (typeof apiMatch.away_team == "string") {
          this.awayTeamId = "team_" + apiMatch.away_team;
          this.awayTeamCountry = apiMatch.away_team;
        } else if (apiMatch.away_team) {
          this.awayTeam = new MatchTeam(client, apiMatch.away_team, { match: this }, { statistics: apiMatch.away_team_statistics });
          this.awayTeamId = "team_" + apiMatch.away_team.country;
          this.awayTeamCountry = apiMatch.away_team.country;
        }
        if (apiMatch.weather)
          this.weather = new MatchWeather(client, apiMatch.weather, { match: this });
        if (apiMatch.detailed_time)
          this.detailedTime = new MatchTime(client, apiMatch.detailed_time, { match: this });
        if (this.homeTeam && this.awayTeam)
          this.teams = [this.homeTeam, this.awayTeam];
        __privateSet(this, _raw, apiMatch);
        this.id = `match_${this.number}`;
      }
      static async fetch(id, client) {
        const data = await client.api.matches[parseId(id)].get();
        return new _Match(client, data);
      }
      async fetch(id) {
        const data = new _Match(this.client, await this.client.api.matches[parseId(id ?? this.id)].get());
        for (const item in data) {
          this[item] = data[item];
        }
        return this;
      }
      static transformations() {
        return transformations;
      }
    };
    var Match = _Match;
    _raw = new WeakMap();
    module2.exports = Match;
  }
});

// src/classes/Team.js
var require_Team = __commonJS({
  "src/classes/Team.js"(exports2, module2) {
    var BaseData = require_BaseData();
    var Group2 = require_Group();
    var { parseId } = require_utils();
    var transformations = {
      country: "country",
      name: "name",
      groupPoints: "group_points",
      wins: "wins",
      draws: "draws",
      losses: "losses",
      goalsFor: "goals_for",
      goalsAgainst: "goals_against",
      goalDifferential: "goal_differential"
    };
    var _raw;
    var _Team = class extends BaseData {
      constructor(client, apiTeam, { group } = {}) {
        super(client, apiTeam, transformations);
        __privateAdd(this, _raw, void 0);
        const Match = require_Match();
        if (apiTeam instanceof _Team)
          return apiTeam;
        if (group)
          this.group = group;
        if (apiTeam.last_match)
          this.lastMatch = new Match(client, apiTeam.last_match);
        if (apiTeam.next_match)
          this.nextMatch = new Match(client, apiTeam.next_match);
        __privateSet(this, _raw, apiTeam);
        this.id = `team_${this.country}`;
      }
      static async fetch(id, client) {
        return new _Team(client, await client.api.teams[parseId(id)].get());
      }
      async fetch(id) {
        const data = new _Team(this.client, await this.client.api.teams[parseId(id ?? this.id)].get());
        for (const item in data) {
          this[item] = data[item];
        }
        return this;
      }
      static transformations() {
        return transformations;
      }
      get flag() {
        return `https://api.fifa.com/api/v3/picture/flags-sq-3/${this.country}`;
      }
    };
    var Team = _Team;
    _raw = new WeakMap();
    module2.exports = Team;
  }
});

// src/classes/Group.js
var require_Group = __commonJS({
  "src/classes/Group.js"(exports2, module2) {
    var BaseData = require_BaseData();
    var Collection2 = require_Collection();
    var Team = require_Team();
    var _raw;
    var _Group = class extends BaseData {
      constructor(client, apiGroup) {
        super(client, apiGroup);
        __privateAdd(this, _raw, void 0);
        if (apiGroup instanceof _Group)
          return apiGroup;
        this.letter = apiGroup.letter;
        this.teams = Collection2.fromArray(apiGroup.teams.map((team) => new Team(client, team, { group: this })));
        __privateSet(this, _raw, apiGroup);
        this.id = `group_${this.letter}`;
      }
    };
    var Group2 = _Group;
    _raw = new WeakMap();
    module2.exports = Group2;
  }
});

// src/classes/Subscription.js
var require_Subscription = __commonJS({
  "src/classes/Subscription.js"(exports2, module2) {
    var { EventEmitter } = require("events");
    var _oldData;
    var Subscription = class extends EventEmitter {
      constructor(client, manager, interval = 3e4, options) {
        super();
        __privateAdd(this, _oldData, {});
        this.manager = new manager(client);
        this.interval = interval;
        this.options = options;
        __privateSet(this, _oldData, {});
      }
      _diff(oldData, newData) {
        return true;
      }
      start() {
        if (!this.intervalId)
          this.intervalId = setInterval(async () => {
            console.log("finding");
            const data = await this.manager.fetch(this.options);
            const diff = this._diff(__privateGet(this, _oldData), data);
            __privateSet(this, _oldData, data);
            if (diff)
              this.emit("update", data, __privateGet(this, _oldData));
          }, this.interval);
        this.manager.fetch(this.options).then((data) => {
          __privateSet(this, _oldData, data);
          this.emit("update", data, {});
        });
      }
      onUpdate(fn) {
        this.on("update", fn);
      }
      end() {
        if (this.intervalId)
          clearInterval(this.intervalId);
      }
    };
    _oldData = new WeakMap();
    module2.exports = Subscription;
  }
});

// src/classes/Manager.js
var require_Manager = __commonJS({
  "src/classes/Manager.js"(exports2, module2) {
    var { isIdResolvable } = require_utils();
    var Subscription = require_Subscription();
    var Manager2 = class {
      constructor(client, endpoint, DataClass) {
        this.client = client;
        this.endpoint = endpoint;
        this._DataClass = DataClass;
      }
      static _isResolvable(id, type) {
        return isIdResolvable(id, type);
      }
      subscribe(interval, fetchOptions) {
        const subscription = new Subscription(this.client, this.constructor, interval, fetchOptions);
        subscription.start();
        return subscription;
      }
    };
    module2.exports = Manager2;
  }
});

// src/classes/GroupManager.js
var Collection = require_Collection();
var Group = require_Group();
var Manager = require_Manager();
var GroupManager = class extends Manager {
  constructor(client) {
    super(client, client.api.teams.get, Group);
  }
  get cache() {
    return this.client.cache.groups;
  }
  _transform(rawGroup) {
    var _a, _b, _c;
    const transformed = new this._DataClass(this.client, rawGroup);
    if (transformed.id && ((_c = (_b = (_a = this == null ? void 0 : this.client) == null ? void 0 : _a.cache) == null ? void 0 : _b.groups) == null ? void 0 : _c.set)) {
      if (this.client.cache.groups.has(transformed.id)) {
        const cached = this.client.cache.groups.get(transformed.id);
        const updated = Object.assign(cached, transformed);
        this.client.cache.groups.set(transformed.id, updated);
      } else {
        this.client.cache.groups.set(transformed.id, transformed);
      }
    }
    return transformed;
  }
  async fetch() {
    const { groups } = await this.client.api.teams.get();
    return Collection.fromArray(groups.map(this._transform.bind(this)));
  }
};
module.exports = GroupManager;
