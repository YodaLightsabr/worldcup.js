class DataError extends Error {
    constructor (message) {
        super(message);
        this.name = this.constructor.name;
    }
}

module.exports = {
    parseId: (id) => id.substring(id.indexOf('_') + 1),
    DataError
};