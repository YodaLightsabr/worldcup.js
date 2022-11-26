const { APIError } = require('./utils.js');
const { default: API } = require('@api-blueprints/pathmaker');

const api = (baseUrl, limiter) => new API({
    headers: {
        'Accept': 'application/json'
    },
    outputParser: raw => {
        let json;
        try {
            json = JSON.parse(raw);
        } catch (e) {
            throw new APIError('API response is not valid JSON');
        }
        if (json?.message) throw new APIError(json.message);
        return json;
    },
    rateLimitHandler: limiter,
    baseUrl: baseUrl
}); 

module.exports = api;