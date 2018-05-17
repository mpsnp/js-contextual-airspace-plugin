module.exports = [{
    "id": 1,
    "name": "United States",
    "region": "federal",
    "rulesets": {
        "required": [{
            "id": "usa_sec_91",
            "name": "US Restricted and Special Use Airspace",
            "short_name": "Restricted Airspace",
            "selection_type": "required",
            "layers": [],
            "default": false,
            "region": "federal",
            "jurisdiction": 1
        }, {
            "id": "usa_national_park",
            "name": "USA National Parks Public Use Limits",
            "short_name": "US NPS",
            "selection_type": "required",
            "layers": [],
            "default": false,
            "region": "federal",
            "jurisdiction": 1
        }, {
            "id": "usa_national_marine_sanctuary",
            "name": "USA National Marine Sanctuary Program Rules",
            "short_name": "US NMSP",
            "selection_type": "required",
            "layers": [],
            "default": false,
            "region": "federal",
            "jurisdiction": 1
        }],
        "pick1": [{
            "id": "usa_sec_336",
            "name": "Fly for Fun (Part 336/101E)",
            "short_name": "Fly for Fun",
            "selection_type": "pick1",
            "layers": [],
            "default": true,
            "region": "federal",
            "jurisdiction": 1
        }, {
            "id": "usa_sec_333",
            "name": "FAA Part 333 Exemption Holder",
            "short_name": "FAA-333",
            "selection_type": "pick1",
            "layers": [],
            "default": false,
            "region": "federal",
            "jurisdiction": 1
        }, {
            "id": "usa_part_107",
            "name": "FAA Part 107 Certified",
            "short_name": "FAA-107",
            "selection_type": "pick1",
            "layers": [],
            "default": false,
            "region": "federal",
            "jurisdiction": 1
        }],
        "optional": [{
            "id": "us_airmap_rules",
            "name": "AIRMAP Recommended Guidelines for US",
            "short_name": "AIRMAP",
            "selection_type": "optional",
            "layers": [],
            "default": false,
            "region": "federal",
            "jurisdiction": 1
        }]
    }
}, {
    "id": 190,
    "name": "New Orleans",
    "region": "city",
    "rulesets": {
        "required": [],
        "pick1": [{
            "id": "us_la_new_orleans_com_rules",
            "name": "Commercial Drone Flights in New Orleans",
            "short_name": "Commercial",
            "selection_type": "pick1",
            "layers": [],
            "default": false,
            "region": "city",
            "jurisdiction": 190
        }, {
            "id": "us_la_new_orleans_rec_rules",
            "name": "Recreational Drone Flights in New Orleans",
            "short_name": "Recreational",
            "selection_type": "pick1",
            "layers": [],
            "default": false,
            "region": "city",
            "jurisdiction": 190
        }],
        "optional": []
    }
}]
