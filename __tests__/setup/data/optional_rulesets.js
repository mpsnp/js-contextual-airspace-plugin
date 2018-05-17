module.exports = {
    unparsed: [{
        id: 1,
        name: 'US',
        region: 'federal',
        rulesets: {
            optional: [{
                id: 'usa_airmap_rules',
                name: 'AIRMAP Recommended Guidelines',
                short_name: 'AirMap',
                short_description: 'These are advisory rules set by AirMap for US drone flights',
                selection_type: 'optional',
                layers: [
                  'airport',
                  'hospital',
                  'power_plant',
                  'prison',
                  'school'
                ],
                'default': false,
                region: 'federal',
                jurisdiction: 1
              }, {
                id: 'custom_lql74k_drone_rules',
                name: 'Kentucky Revised Statutes',
                short_name: 'Drone Rules',
                short_description: 'Required for Recreational Drone Flights within 5 miles of CVG airport per Kentucky Revised Statutes HB 540',
                selection_type: 'optional',
                layers: [
                  'custom'
                ],
                'default': true,
                region: 'local',
                jurisdiction: 493
              }, {
                id: 'custom_xxk_drone_rules',
                name: 'Custom Non Default or AirMap',
                short_name: 'Drone Rules',
                short_description: 'Required for Recreational Drone Flights within 5 miles of CVG airport per Jurisdiction Law',
                selection_type: 'optional',
                layers: [
                  'custom'
                ],
                'default': false,
                region: 'local',
                jurisdiction: 493
              }]
        }
    }],
    airmap_selected: [{
      id: 'usa_airmap_rules',
      name: 'AIRMAP Recommended Guidelines',
      short_name: 'AirMap',
      short_description: 'These are advisory rules set by AirMap for US drone flights',
      selection_type: 'optional',
      layers: [
        'airport',
        'hospital',
        'power_plant',
        'prison',
        'school'
      ],
      'default': false,
      region: 'federal',
      jurisdiction: 1
    }, {
      id: 'custom_lql74k_drone_rules',
      name: 'Kentucky Revised Statutes',
      short_name: 'Drone Rules',
      short_description: 'Required for Recreational Drone Flights within 5 miles of CVG airport per Kentucky Revised Statutes HB 540',
      selection_type: 'optional',
      layers: [
        'custom'
      ],
      'default': true,
      region: 'local',
      jurisdiction: 493
    }, {
      id: 'custom_xxk_drone_rules',
      name: 'Custom Non Default or AirMap',
      short_name: 'Drone Rules',
      short_description: 'Required for Recreational Drone Flights within 5 miles of CVG airport per Jurisdiction Law',
      selection_type: 'optional',
      layers: [
        'custom'
      ],
      'default': false,
      region: 'local',
      jurisdiction: 493
    }],
    default_true_selected: [{
      id: 'usa_airmap_rules',
      name: 'AIRMAP Recommended Guidelines',
      short_name: 'AirMap',
      short_description: 'These are advisory rules set by AirMap for US drone flights',
      selection_type: 'optional',
      layers: [
        'airport',
        'hospital',
        'power_plant',
        'prison',
        'school'
      ],
      'default': false,
      region: 'federal',
      jurisdiction: 1
    }, {
      id: 'custom_lql74k_drone_rules',
      name: 'Kentucky Revised Statutes',
      short_name: 'Drone Rules',
      short_description: 'Required for Recreational Drone Flights within 5 miles of CVG airport per Kentucky Revised Statutes HB 540',
      selection_type: 'optional',
      layers: [
        'custom'
      ],
      'default': true,
      region: 'local',
      jurisdiction: 493
    }]
}