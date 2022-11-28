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

// src/classes/Subscription.js
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
module.exports = Subscription;
