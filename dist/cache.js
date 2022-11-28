var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// src/cache.js
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
