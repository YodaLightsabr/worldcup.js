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

// src/classes/MatchTime.js
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
