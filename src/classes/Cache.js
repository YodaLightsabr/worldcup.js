// TODO: Implement and use caching

class Cache {
    constructor () {
        this.cache = {};
    }

    getCollection (collectionName) {
        return this.cache[collectionName];
    }

    getCollectionKey (collectionName, key) {
        return this.cache[collectionName]?.[key];
    }

    clearCollection (collectionName) {
        return this.cache[collectionName] = {};
    }

    setCollection (collectionName, collectionData) {
        return this.cache[collectionName] = Object.apply(this.cache[collectionName], collectionData);
    }

    setCollectionKey (collectionName, key, value) {
        return this.cache[collectionName]?.[key] = value;
    }
}

module.exports = Cache;