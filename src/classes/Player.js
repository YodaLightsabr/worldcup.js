const BaseData = require('./BaseData.js');

const transformations = {
    name: "name",
    shirtNumber: "shirt_number",
    position: "position"
};

class Player extends BaseData {
    #raw;

    constructor (client, apiPlayer, { match } = {}, { team }) {
        console.log(apiPlayer);
        super(client, apiPlayer, transformations);

        if (apiPlayer instanceof Player) return apiPlayer;

        if (this.currentTime?.endsWith && this.currentTime.endsWith('\'')) this.minutes = +this.currentTime.substring(0, this.currentTime.length - 1);

        if (team) this.team = team;

        this.#raw = apiPlayer;
        this.id = `player_${team.country}${this.shirtNumber}`;
    }
}

module.exports = Player;
