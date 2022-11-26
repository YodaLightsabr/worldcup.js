# worldcup.js

A JavaScript API client for [worldcupjson.net](https://worldcupjson.net).

--------------
## Installation

```sh
# with npm
npm install worldcup.js

# with yarn
yarn add worldcup.js
```

## Usage

```js
// cjs
const { Client } = require('worldcup.js');
const client = new Client();

// esm
import WorldCup from 'worldcup.js';
const client = new WorldCup.Client();
```

worldcup.js uses a Client/Manager/Cache system with the ability to fetch teams, groups, matches, and detailed match information from the API.

worldcup.js also has an ID system, where the `.id` of any object is a unique string value across all objects. This can be passed into a manager to re-fetch the data or store relations. For example, to fetch the specific team with the ID `team_USA`, I could call `client.teams.fetch('team_USA')`.

### Managers

Managers extending from the `Manager` exist for matches, teams, and groups entitled `MatchManager`, `TeamManager`, and `GroupManager` respectively. Calling the `fetch()` method on any Manager will fetch all when given no parameters, fetch an ID when passed an ID, and sort when passed in an object with sorting critera. These functions return a collection of `Team`s, `Group`s, or `Match`es.

### Collections

A `Collection` is an ordered key/value pair built off of the `Map` class. Managers will return a collection of items when fetching as well as when storing cached items.

### Ratelimits

This package implements ratelimiting at 5 requests per 30 seconds (the API itself has a limit of 10 per 60 seconds).

## Detailed requests

Detailed requests are any requests made directly to an object (like fetching a specific team or match) or any fetch with the option `detailed` set to `true`.

### Some examples:

Get matches today
```js
console.log(await client.matches.fetch({ dateRange: 'today' })); // -> Collection<id, Match>
```

Load API data into cache
```js
await client.load();
console.log(client.cache.matches); // -> Collection<id, Match>
console.log(client.cache.teams); // -> Collection<id, Team>
console.log(client.cache.groups); // -> Collection<id, Group>
```

Get all teams as an array
```js
const teams = await client.teams.fetch();
console.log(teams.toArray()); // -> [ Team, Team, ... ]
```

## Reference

### `Match`

Properties:

- `id`:	        `id<Match>` A unique ID for this match
    - Example: `match_5`
- `number`:	    `number` Match number
- `venue`:	    `string` Stadium / venue name
- `status`:	    `string` Match status
- `attendance`:	`number` Number of people in attendance
- `stageName`:	`string` Stage name
- `timestamp`:	`Date` Match timestamp
- `lastUpdated`:	`Date` Last checked from API
- `lastChanged`:	`Date` Last time data was modified
- `homeTeam`:	    `MatchTeam?` The home team as a [`MatchTeam`](#matchteam) ([`Team`](#team) related to a [`Match`](#match)). Only returned if a detailed request is made.
- `awayTeam`:	    `MatchTeam?` The away team as a [`MatchTeam`](#matchteam) ([`Team`](#team) related to a [`Match`](#match)). Only available if a detailed request is made.
- `homeTeamId`:	    `id<Team>?` An ID that can be used to fetch a team.
    - Example: `team_USA`
- `homeTeamCountry`:	`string?` A 3-digit country code
- `awayTeamId`:	`id<Team>?` An ID that can be used to fetch a team.
- `awayTeamCountry`:	`string?` A 3-digit country code
- `weather`:	        `MatchWeather?` Match weather details as a [`MatchTime`](#matchweather) object. Only available if a detailed request is made.
- `detailedTime`:	    `MatchTime?` Match time details as a [`MatchWeather`](#matchtime) object. Only available if a detailed request is made.

### `Group`

Properties:

- `id`:	    `id<Group>` A unique ID for this group
    - Example: `group_B`
- `letter`:	`string` The group's letter
- `teams`:	`Collection<id, Team>` The group's teams

### `Team`

Properties:

- `id`:	        `id<Team>` A unique ID for this team
    - Example: `team_ENG`
- `country`:	`string` A 3-digit FIFA country code for this team
- `name`:	    `string` The country name of this team
- `groupPoints`:	`number` How many points this team has in the group stage
- `wins`:	        `number` How many wins this team has
- `losses`:	        `number` How many losses this team has
- `goalsFor`:	    `number` Goals for this team
- `goalsAgainst`:	`number` Goals against this team
- `goalDifferential`:	`number` Difference in goals scored to goals against

### `MatchTime`

Properties:

- `id`:	        `id<MatchTime>` A unique ID for this match's time
    - Example: `time_5`
- `currentTime`:        The current time
- `firstHalfTime`:      The first half time
- `firstHalfExtraTime`:     The first half extra time
- `secondHalfTime`:         The second half time
- `secondHalfExtraTime`:    The second half extra time

### `MatchWeather`

Properties:

- `id`:	            `id<MatchWeather>` A unique ID for this match's weather
    - Example: `weather_5`
- `humidity`:	    `number` Relative humidity percent
    - Example: `57`
- `temperatureFarenheit`:	`number` Current temperature in degrees Celsius
- `temperatureCelsius`:	    `number` Current temperature in degrees Farenheit 
- `windSpeed`:	    `number` Current windspeed at match
- `description`:	`string` Current conditions description