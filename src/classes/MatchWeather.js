const BaseData = require('./BaseData.js');

const transformations = {
    humidity: 'humidity',
    temperatureFarenheit: 'temp_farenheit',
    temperatureCelsius: 'temp_celsius',
    windSpeed: 'wind_speed',
    description: 'description'
};

class MatchWeather extends BaseData {
    #raw;

    constructor (client, apiMatchWeather, { match } = {}) {
        super(client, apiMatchWeather, transformations);

        if (apiMatchWeather instanceof MatchWeather) return apiMatchWeather;

        this.match = match;
        if (!this.match) throw new DataError('MatchWeather must be constructed with a Match');

        this.#raw = apiMatchWeather;
        this.id = `weather_${this.match.number}`;
    }
}

module.exports = MatchWeather;
