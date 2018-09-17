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

const jurisdictionRulesetsOrganizedByType = require('./jurisdictionRulesetsOrganizedByType')
const jurisdictionOrganizedByRegion = require('./jurisdictionOrganizedByRegion')
const rawJurisdictionData = require('./rawJurisdictionData')
const rulesetsList_required = require('./rulesetsList_required')
const rulesetsList_pick1_preferred = require('./rulesetsList_pick1_preferred')
const rulesetsList_pick1_no_preferred = require('./rulesetsList_pick1_no_preferred')
const optionalRulesets = require('./optional_rulesets')
const { options, mergedOptionsObject } = require('./options')

module.exports = {
    jurisdictionOrganizedByRegion,
    jurisdictionRulesetsOrganizedByType,
    rawJurisdictionData,
    rulesetsList_required,
    rulesetsList_pick1_preferred,
    rulesetsList_pick1_no_preferred,
    options,
    mergedOptionsObject,
    optionalRulesets
}
