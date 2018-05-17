<a name="module_ContextualAirspacePlugin"></a>

## ContextualAirspacePlugin
A module that parses our contextual airspace data and sets the map with layers for interacting with that data.


* [ContextualAirspacePlugin](#module_ContextualAirspacePlugin)
    * [module.exports](#exp_module_ContextualAirspacePlugin--module.exports) ⏏
        * [new module.exports(config, opts)](#new_module_ContextualAirspacePlugin--module.exports_new)
        * [.onAdd](#module_ContextualAirspacePlugin--module.exports+onAdd)
        * [.loaded](#module_ContextualAirspacePlugin--module.exports+loaded) ⇒ <code>Boolean</code>
        * [.getJurisdictions](#module_ContextualAirspacePlugin--module.exports+getJurisdictions) ⇒ <code>Array</code>
        * [.getSelectedRulesets](#module_ContextualAirspacePlugin--module.exports+getSelectedRulesets) ⇒ <code>Array</code>
        * [.setTheme](#module_ContextualAirspacePlugin--module.exports+setTheme) ⇒ <code>ContextualAirspace</code>

<a name="exp_module_ContextualAirspacePlugin--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_ContextualAirspacePlugin--module.exports_new"></a>

#### new module.exports(config, opts)
Configure map and set options.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | AirMap configuration object containing an API Key. |
| config.airmap.api_key | <code>string</code> |  | AirMap API Key from the developer dashboard. |
| opts | <code>Object</code> |  | Plugin options. |
| [opts.preferredRulesets] | <code>Array</code> | <code>[]</code> | Array of Ruleset IDs to be used when the Rules plugin loads. |
| [opts.overrideRulesets] | <code>Array</code> | <code>[]</code> | Array of Ruleset IDs, when override rulesets are preset, only these rulesets will be applied to the map. |
| opts.enableRecommendedRulesets | <code>boolean</code> |  | Specifies whether the plugin should include all recommended rulesets. |
| opts.theme | <code>string</code> |  | Themes: light, dark, standard, satellite. Will specify how to style airspace layers. |

<a name="module_ContextualAirspacePlugin--module.exports+onAdd"></a>

#### module.exports.onAdd
Adds the control from the map it has been added to. This is called by `map.addControl`,
which is the recommended method to remove controls.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_ContextualAirspacePlugin--module.exports)  
<a name="module_ContextualAirspacePlugin--module.exports+loaded"></a>

#### module.exports.loaded ⇒ <code>Boolean</code>
Returns a Boolean indicating whether the plugin is fully loaded.
Returns false if the plugin is not yet fully loaded.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_ContextualAirspacePlugin--module.exports)  
**Returns**: <code>Boolean</code> - - true if the plugin is fully loaded, false if otherwise  
**Access**: public  
<a name="module_ContextualAirspacePlugin--module.exports+getJurisdictions"></a>

#### module.exports.getJurisdictions ⇒ <code>Array</code>
Allows the consuming app to call for the latest list of jurisdictions and returns them.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_ContextualAirspacePlugin--module.exports)  
**Returns**: <code>Array</code> - - A list of deduped jurisdictions found when querying the map.  
**Access**: public  
<a name="module_ContextualAirspacePlugin--module.exports+getSelectedRulesets"></a>

#### module.exports.getSelectedRulesets ⇒ <code>Array</code>
Allows the consuming app to call for the latest list of selected rulesets and returns them.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_ContextualAirspacePlugin--module.exports)  
**Returns**: <code>Array</code> - - A list of deduped jurisdictions found when querying the map.  
**Access**: public  
<a name="module_ContextualAirspacePlugin--module.exports+setTheme"></a>

#### module.exports.setTheme ⇒ <code>ContextualAirspace</code>
Sets the theme.

**Kind**: instance property of [<code>module.exports</code>](#exp_module_ContextualAirspacePlugin--module.exports)  
**Returns**: <code>ContextualAirspace</code> - - `this`  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [theme] | <code>string</code> | base map theme, sets airspace layers accordingly. |

