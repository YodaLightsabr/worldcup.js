class Collection extends Map {

    /**
     * Create a Collection
     * @constructor
     * @param {<any, any>} Iterable array or object 
     */
    constructor (iterable) {
        super(iterable);
    }

    /**
     * Convert Collection to array
     * @returns {Array}
     */
    toArray () {
        return [ ...this.values() ];
    }

    /**
     * Get the first item in a collection 
     * @returns {*}
     */
    first () {
        return ([ ...this.values() ])[0];
    }

    /**
     * Get the last item in a collection
     * @returns {*}
     */
    last () {
        return ([ ...this.values() ])[-1];
    }

    /**
     * Generate a Collection from an object
     * @param {object} object 
     * @returns {Collection}
     */
    static fromObject (object) {
        return new Collection(Object.entries(object));
    }

    /**
     * Generate a Collection from an array
     * @param {Array} array The array to use
     * @param {string} indexable The key to index by
     * @returns {Collection}
     */
    static fromArray (array, indexable = 'id') {
        const collection = new Collection();
        for (const item of array) {
            if (item?.[indexable]) {
                collection.set(item[indexable], item);
            }
        }
        return collection;
    }
}

module.exports = Collection;