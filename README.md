AirMap's Mapbox GL Contextual Airspace Plugin
---

A control for [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js) Mapbox GL JS plugin to view
and interact with AirMap's Contextual Airspace Rules.

## Usage

### Quick start

```javascript
import Rules from 'airmap-map-rules'

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-118.4932, 34.0135],
    zoom: 13
})

const config = {
    "airmap": {
        "api_key": AIRMAP_API_KEY
    },
    "auth0": {
        "client_id": "",
        "callback_url": ""
    },
    "mapbox": {
        "access_token": MAPBOX_ACCESS_TOKEN
    }
}

const options = {
    measurementUnits: 'metric',
    defaultSelectedRulesets: ['ruleset_id']
}

const RulesPlugin = new Rules(config, options)

map.addControl(RulesPlugin)
```

### Developing

```
$ npm install
$ npm start
$ open http://localhost:8080/
```

If this is your first time developing with the Rules plugin, you'll need to store an AirMap API Key and Mapbox Access Token
in your localStorage for use on the `http://localhost:8080/` demo page:

```javascript
localStorage.setItem('AIRMAP_API_KEY', '<your_key>');
localStorage.setItem('MAPBOX_ACCESS_TOKEN', '<your_token>');
```

Once this is done, you won't need to do it again unless you clear your browser's localStorage.
