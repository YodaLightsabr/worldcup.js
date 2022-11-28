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

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    var DataError = class extends Error {
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
      DataError,
      APIError
    };
  }
});

// src/classes/Subscription.js
var require_Subscription = __commonJS({
  "src/classes/Subscription.js"(exports2, module2) {
    var { EventEmitter } = require("events");
    var _oldData;
    var Subscription2 = class extends EventEmitter {
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
    module2.exports = Subscription2;
  }
});

// src/classes/Manager.js
var { isIdResolvable } = require_utils();
var Subscription = require_Subscription();
var Manager = class {
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
module.exports = Manager;
