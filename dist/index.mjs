var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
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

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports, module) {
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
    module.exports = {
      parseId: (id) => id.substring(id.indexOf("_") + 1),
      isIdResolvable: (id, type) => typeof id == "string" && id.startsWith(type + "_"),
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      formatDate,
      DataError: DataError2,
      APIError
    };
  }
});

// src/api.js
var require_api = __commonJS({
  "src/api.js"(exports, module) {
    var { APIError } = require_utils();
    var { default: API } = __require("@api-blueprints/pathmaker");
    var api = (baseUrl, limiter) => new API({
      headers: {
        "Accept": "application/json"
      },
      outputParser: (raw) => {
        let json;
        try {
          json = JSON.parse(raw);
        } catch (e) {
          throw new APIError("API response is not valid JSON");
        }
        if (json == null ? void 0 : json.message)
          throw new APIError(json.message);
        return json;
      },
      rateLimitHandler: limiter,
      baseUrl
    });
    module.exports = api;
  }
});

// src/classes/Collection.js
var require_Collection = __commonJS({
  "src/classes/Collection.js"(exports, module) {
    var Collection = class extends Map {
      constructor(iterable) {
        super(iterable);
      }
      toArray() {
        return this.values();
      }
      first() {
        return this.values()[0];
      }
      last() {
        return this.values()[-1];
      }
      static fromObject(object) {
        return new Collection(Object.entries(object));
      }
      static fromArray(array, indexable = "id") {
        const collection = new Collection();
        for (const item of array) {
          if (item == null ? void 0 : item[indexable]) {
            collection.set(item[indexable], item);
          }
        }
        return collection;
      }
    };
    module.exports = Collection;
  }
});

// src/classes/BaseData.js
var require_BaseData = __commonJS({
  "src/classes/BaseData.js"(exports, module) {
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
    module.exports = BaseData;
  }
});

// src/classes/MatchTeam.js
var require_MatchTeam = __commonJS({
  "src/classes/MatchTeam.js"(exports, module) {
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
    module.exports = MatchTeam;
  }
});

// src/classes/MatchWeather.js
var require_MatchWeather = __commonJS({
  "src/classes/MatchWeather.js"(exports, module) {
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
    module.exports = MatchWeather;
  }
});

// src/classes/MatchTime.js
var require_MatchTime = __commonJS({
  "src/classes/MatchTime.js"(exports, module) {
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
    module.exports = MatchTime;
  }
});

// src/classes/Match.js
var require_Match = __commonJS({
  "src/classes/Match.js"(exports, module) {
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
    module.exports = Match;
  }
});

// src/classes/Team.js
var require_Team = __commonJS({
  "src/classes/Team.js"(exports, module) {
    var BaseData = require_BaseData();
    var Group = require_Group();
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
    };
    var Team = _Team;
    _raw = new WeakMap();
    module.exports = Team;
  }
});

// src/classes/Group.js
var require_Group = __commonJS({
  "src/classes/Group.js"(exports, module) {
    var BaseData = require_BaseData();
    var Team = require_Team();
    var _raw;
    var _Group = class extends BaseData {
      constructor(client, apiGroup) {
        super(client, apiGroup);
        __privateAdd(this, _raw, void 0);
        if (apiGroup instanceof _Group)
          return apiGroup;
        this.letter = apiGroup.letter;
        this.teams = apiGroup.teams.map((team) => new Team(client, team, { group: this }));
        __privateSet(this, _raw, apiGroup);
        this.id = `group_${this.letter}`;
      }
    };
    var Group = _Group;
    _raw = new WeakMap();
    module.exports = Group;
  }
});

// src/classes/Manager.js
var require_Manager = __commonJS({
  "src/classes/Manager.js"(exports, module) {
    var { isIdResolvable } = require_utils();
    var Manager = class {
      constructor(client, endpoint, DataClass) {
        this.client = client;
        this.endpoint = endpoint;
        this._DataClass = DataClass;
      }
      static _isResolvable(id, type) {
        return isIdResolvable(id, type);
      }
    };
    module.exports = Manager;
  }
});

// src/classes/GroupManager.js
var require_GroupManager = __commonJS({
  "src/classes/GroupManager.js"(exports, module) {
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
      async fetch(id) {
        const { groups } = await this.client.api.teams.get();
        return Collection.fromArray(groups.map(this._transform.bind(this)));
      }
    };
    module.exports = GroupManager;
  }
});

// src/classes/MatchManager.js
var require_MatchManager = __commonJS({
  "src/classes/MatchManager.js"(exports, module) {
    var Match = require_Match();
    var Manager = require_Manager();
    var { parseId, formatDate } = require_utils();
    var Team = require_Team();
    var Collection = require_Collection();
    var MatchManager = class extends Manager {
      constructor(client) {
        super(client, client.api.matches.get, Match);
      }
      get cache() {
        return this.client.cache.matches;
      }
      _transform(rawMatch) {
        var _a, _b, _c;
        const transformed = new this._DataClass(this.client, rawMatch);
        if (transformed.id && ((_c = (_b = (_a = this == null ? void 0 : this.client) == null ? void 0 : _a.cache) == null ? void 0 : _b.matches) == null ? void 0 : _c.set)) {
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
      async fetch(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        if (Manager._isResolvable(config, "match")) {
          return await Match.fetch(config, this.client);
        }
        const searchParams = {};
        if (typeof config === "object") {
          if (config.detailed)
            searchParams.details = "true";
          else if (config.detailed === false)
            searchParams.details = "false";
          if (typeof config.sort === "string") {
            if (config.sort.toLowerCase() === "date")
              searchParams.by_date = "asc";
            else if (config.sort.toLowerCase() === "dateAscending")
              searchParams.by_date = "asc";
            else if (config.sort.toLowerCase() === "dateDescending")
              searchParams.by_date = "asc";
            else if (config.sort.toLowerCase() === "totalGoals")
              searchParams.by = "total_goals";
            else if (config.sort.toLowerCase() === "homeTeamGoals")
              searchParams.by = "home_team_goals";
            else if (config.sort.toLowerCase() === "awayTeamGoals")
              searchParams.by = "away_team_goals";
            else if (config.sort.toLowerCase() === "closestScores")
              searchParams.by = "closes_scores";
            else
              searchParams.by = config.sort;
          }
          if (((_a = config.byDate) == null ? void 0 : _a.toLowerCase) && ((_b = config.byDate) == null ? void 0 : _b.toLowerCase()) === "ascending")
            searchParams.by_date = "asc";
          else if (((_c = config.byDate) == null ? void 0 : _c.toLowerCase) && ((_d = config.byDate) == null ? void 0 : _d.toLowerCase()) === "descending")
            searchParams.by_date = "desc";
          if (((_e = config.dateRange) == null ? void 0 : _e.toLowerCase) && ((_f = config.dateRange) == null ? void 0 : _f.toLowerCase()) === "today") {
            return await this._fetchToday(searchParams);
          } else if (((_g = config.dateRange) == null ? void 0 : _g.toLowerCase) && ((_h = config.dateRange) == null ? void 0 : _h.toLowerCase()) === "yesterday") {
            return await this._fetchYesterday(searchParams);
          } else if (((_i = config.dateRange) == null ? void 0 : _i.toLowerCase) && ((_j = config.dateRange) == null ? void 0 : _j.toLowerCase()) === "current") {
            return await this._fetchCurrent(searchParams);
          } else if (config.dateRange instanceof Array) {
            const [start, end] = config.dateRange;
            if (start)
              searchParams.start = formatDate(start);
            if (end)
              searchParams.end = formatDate(end);
          }
          if (config.team instanceof Team || Manager._isResolvable(config.team, "team")) {
            return await this._fetchByTeam(config.team, searchParams);
          }
        }
        const matches = await this.client.api.matches.get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
      }
      async _fetchToday(searchParams) {
        const matches = await this.client.api.matches.today.searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
      }
      async _fetchYesterday(searchParams) {
        const matches = await this.client.api.matches.yesterday.searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
      }
      async _fetchCurrent(searchParams) {
        const matches = await this.client.api.matches.current.searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
      }
      async _fetchByTeam(team, searchParams) {
        const matches = await this.client.api.matches.country[team instanceof Team ? parseId(team.id) : team.startsWith("team_") ? parseId(team) : team].searchParams(searchParams ?? {}).get();
        return Collection.fromArray(matches.map(this._transform.bind(this)));
      }
    };
    module.exports = MatchManager;
  }
});

// src/classes/TeamManager.js
var require_TeamManager = __commonJS({
  "src/classes/TeamManager.js"(exports, module) {
    var Team = require_Team();
    var Manager = require_Manager();
    var Collection = require_Collection();
    var TeamManager = class extends Manager {
      constructor(client) {
        super(client, client.api.teams.get, Team);
      }
      get cache() {
        return this.client.cache.teams;
      }
      _transform(rawMatch) {
        var _a, _b, _c;
        const transformed = new this._DataClass(this.client, rawMatch);
        if (transformed.id && ((_c = (_b = (_a = this == null ? void 0 : this.client) == null ? void 0 : _a.cache) == null ? void 0 : _b.teams) == null ? void 0 : _c.set)) {
          if (this.client.cache.teams.has(transformed.id)) {
            const cached = this.client.cache.teams.get(transformed.id);
            const updated = Object.assign(cached, transformed);
            this.client.cache.teams.set(transformed.id, updated);
          } else {
            this.client.cache.teams.set(transformed.id, transformed);
          }
        }
        return transformed;
      }
      async fetch(id) {
        if (id)
          return await Team.fetch(id, this.client);
        const teams = await this.client.api.teams.get();
        for (const team of teams) {
          this.client.cache.teams.set(team.id, team);
        }
        return Collection.fromArray(teams.map(this._transform.bind(this)));
      }
    };
    module.exports = TeamManager;
  }
});

// src/cache.js
var require_cache = __commonJS({
  "src/cache.js"(exports, module) {
    var Collection = require_Collection();
    var cacheUtil = () => new Proxy(
      {
        collections: {}
      },
      {
        get(obj, prop) {
          if (!obj.collections[prop])
            obj.collections[prop] = new Collection();
          return obj.collections[prop];
        },
        set(obj, prop, value) {
          obj.collections[prop] = value;
          return true;
        }
      }
    );
    module.exports = cacheUtil;
  }
});

// src/classes/Client.js
var require_Client = __commonJS({
  "src/classes/Client.js"(exports, module) {
    var api = require_api();
    var GroupManager = require_GroupManager();
    var MatchManager = require_MatchManager();
    var TeamManager = require_TeamManager();
    var cacheUtil = require_cache();
    var { RateLimiter } = __require("limiter");
    var Client = class {
      constructor(baseEndpoint = "https://worldcupjson.net") {
        this.baseEndpoint = baseEndpoint;
        this.groups = new GroupManager(this);
        this.matches = new MatchManager(this);
        this.teams = new TeamManager(this);
        this.cache = cacheUtil();
        this.limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1e3 * 30 });
      }
      async rateLimitHandler() {
        return await this.limiter.removeTokens(1);
      }
      get api() {
        return api(this.baseEndpoint, this.rateLimitHandler.bind(this));
      }
    };
    module.exports = Client;
  }
});

// src/index.js
var require_src = __commonJS({
  "src/index.js"(exports, module) {
    var Client = require_Client();
    var items = {
      Client,
      Group: require_Group(),
      GroupManager: require_GroupManager(),
      Match: require_Match(),
      MatchManager: require_MatchManager(),
      Team: require_Team(),
      TeamManager: require_TeamManager(),
      MatchTeam: require_MatchTeam(),
      MatchTime: require_MatchTime(),
      MatchWeather: require_MatchWeather(),
      cacheUtil: require_cache(),
      Collection: require_Collection(),
      Manager: require_Manager(),
      utils: require_utils()
    };
    module.exports = (baseEndpoint) => new Client(baseEndpoint);
    for (const item in items) {
      module.exports[item] = items[item];
    }
  }
});
export default require_src();