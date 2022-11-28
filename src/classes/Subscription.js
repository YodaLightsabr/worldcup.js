const { EventEmitter } = require('events');

class Subscription extends EventEmitter {
    #oldData = {};

    constructor (client, manager, interval = 30000, options) {
        super();
        this.manager = new manager(client);
        this.interval = interval;
        this.options = options;
        this.#oldData = {};
    }

    _diff (oldData, newData) {
        return true;
    }

    start () {
        if (!this.intervalId) this.intervalId = setInterval(async () => {
            console.log('finding')
            const data = await this.manager.fetch(this.options);
            const diff = this._diff(this.#oldData, data);
            this.#oldData = data;
            if (diff) this.emit('update', data, this.#oldData);
        }, this.interval);
        this.manager.fetch(this.options).then(data => {
            this.#oldData = data;
            this.emit('update', data, {});
        });
    }

    onUpdate (fn) {
        this.on('update', fn);
    }

    end () {
        if (this.intervalId) clearInterval(this.intervalId);
    }
}

module.exports = Subscription;