var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    var DataError = class extends Error {
      constructor(message) {
        super(message);
        this.name = this.constructor.name;
      }
    };
    var APIError2 = class extends Error {
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
      DataError,
      APIError: APIError2
    };
  }
});

// src/api.js
var { APIError } = require_utils();
var { default: API } = require("@api-blueprints/pathmaker");
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
