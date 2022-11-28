// src/classes/BaseData.js
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
