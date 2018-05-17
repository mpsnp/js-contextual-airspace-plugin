module.exports = [{
    "id": "usa_part_107",
    "name": "FAA Part 107 Certified",
    "short_name": "FAA-107",
    "selection_type": "pick1",
    "layers": [],
    "default": false,
    "region": "federal",
    "jurisdiction": 1
}, {
    "id": "us_la_new_orleans_com_rules",
    "name": "Commercial Drone Flights in New Orleans",
    "short_name": "Commercial",
    "selection_type": "pick1",
    "layers": ["non_geo", "park"],
    "default": false,
    "region": "city",
    "jurisdiction": 190
}, {
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
}]
