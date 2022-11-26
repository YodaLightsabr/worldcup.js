const Collection = require('./classes/Collection.js');

const cacheUtil = () => new Proxy(
    {
        collections: {},
    },
    {
        get(obj, prop) {
            if (!obj.collections[prop]) obj.collections[prop] = new Collection();
            return obj.collections[prop];
        },
        set(obj, prop, value) {
            obj.collections[prop] = value;
            return true;
        }
    }
);

module.exports = cacheUtil;