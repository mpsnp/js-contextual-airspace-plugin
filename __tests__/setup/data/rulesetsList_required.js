/* Copyright 2018 AirMap, Inc.

Licensed under the Apache License, Version 2.0 (the License);
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an AS IS BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

module.exports = [{
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
