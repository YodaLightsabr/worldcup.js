var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
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

// src/classes/BaseData.js
var require_BaseData = __commonJS({
  "src/classes/BaseData.js"(exports2, module2) {
    var BaseData2 = class {
      constructor(client, apiData, transformations2) {
        this.client = client;
        const transformed = BaseData2.transform(apiData, transformations2);
        for (const key in transformed) {
          this[key] = transformed[key];
        }
      }
      static transform(apiData, transformations2) {
        const output = {};
        for (const transformation in transformations2) {
          if (apiData[transformations2[transformation]]) {
            let transformed = apiData[transformations2[transformation]];
            output[transformation] = transformed;
          }
        }
        return output;
      }
    };
    module2.exports = BaseData2;
  }
});

// src/classes/MatchWeather.js
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
