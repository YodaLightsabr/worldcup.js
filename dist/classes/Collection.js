// src/classes/Collection.js
var Collection = class extends Map {
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
