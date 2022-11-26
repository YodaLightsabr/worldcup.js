const { default: API } = require('@api-blueprints/pathmaker');

const api = (baseUrl) => new API({
    headers: {
        'Accept': 'application/json'
    },
    baseUrl: baseUrl
}); 

module.exports = api;