
  // contains static tables for unit measurements that should never change.

  export class Unitstable {

      // all math libraries expect grams
      static weightunits: Array<any> = [
        {'id': 0, 'unit': 'g', 'longname': 'grams', 'tokg': '0.001', 'kgto': '1000', 'default': '0'},
        {'id': 1, 'unit': 'kg', 'longname': 'kilograms', 'tokg': '1', 'kgto': '1', 'default': '1'},
        {'id': 3, 'unit': 'lb', 'longname': 'pounds', 'tokg': '0.453592', 'kgto': '2.20462', 'default': '0'}
      ];

      static lenghthunits: Array<any> = [
        {'id': 0, 'unit': 'cm', 'longname': 'centimeters', 'tocm': '1', 'cmto': '1', 'default': '1'},
        {'id': 1, 'unit': 'in', 'longname': 'inches', 'tocm': '2.54', 'cmto': '0.393701', 'default': '0'}
      ];

      // all math libraries expect ml
      static volumeunits: Array<any> = [
        {'id': 0, 'unit': 'ml', 'longname': 'Milliliters', 'conversion': '1', 'default': '1'},
        {'id': 1, 'unit': 'l', 'longname': 'Liters', 'conversion': '0.001', 'default': '0'},
      ];

      // all math libraries expect kcal
      static calorieunits: Array<any> = [
        {'id': 0, 'unit': 'cal', 'longname': 'calories', 'conversion': '1', 'default': '0'},
        {'id': 1, 'unit': 'kcal', 'longname': 'kilocalories', 'conversion': '0.001', 'default': '1'},
      ];

      // all math libraries expect ?
      static electorlyteunits: Array<any> = [
        {'id': 0, 'unit': 'mEqml', 'longname': 'mEq/gm/day', 'conversion': '1', 'default': '0'},
        {'id': 1, 'unit': 'mEqL', 'longname': 'mEq/kg/day', 'conversion': '1', 'default': '1'},
        {'id': 2, 'unit': 'mgdL', 'longname': 'mMol/kg/day', 'conversion': '0.001', 'default': '0'},
        {'id': 3, 'unit': 'mgL', 'longname': 'mEq/kcal', 'conversion': '0.001', 'default': '0'},
        {'id': 4, 'unit': 'gmdL', 'longname': 'mMol/kcal', 'conversion': '0.001', 'default': '0'},
      ];

      // all math libraries expect ?
      static electorlytlabseunits: Array<any> = [
        {'id': 0, 'unit': 'mEqml', 'longname': 'mEq/ml', 'conversion': '1', 'default': '1'},
        {'id': 1, 'unit': 'mEqL', 'longname': 'mEq/L', 'conversion': '1', 'default': '0'},
        {'id': 2, 'unit': 'mgdL', 'longname': 'mg/dL', 'conversion': '0.001', 'default': '0'},
        {'id': 3, 'unit': 'mgL', 'longname': 'mg/L', 'conversion': '0.001', 'default': '0'},
        {'id': 4, 'unit': 'gmdL', 'longname': 'gm/dL', 'conversion': '0.001', 'default': '0'},
        {'id': 5, 'unit': 'mgL', 'longname': 'mg/L', 'conversion': '0.001', 'default': '0'},
      ];

      static valencetable: Array<any> = [
        {
            'symbol': 'na',
            'element': 'Sodium',
            'AtomicWeight': 22.98976928,
            'density': 0.971,
            'Valence': 1,
            '1meq': 23,
            '1mm': 23,
            '1mmequals': 1,
            'meqg': 43.5,
            'mmg': 43.5
        },
        {
            'symbol': 'cl',
            'element': 'Chloride',
            'AtomicWeight': 35.45,
            'density': 0.003214,
            'Valence': 1,
            '1meq': 35.5,
            '1mm': 35.5,
            '1mmequals': 1,
            'meqg': 28.2,
            'mmg': 28.2
        },
        {
            'symbol': 'k',
            'element': 'Potassium',
            'AtomicWeight': 39.0983,
            'density': 0.862,
            'Valence': 1,
            '1meq': 39,
            '1mm': 39,
            '1mmequals': 1,
            'meqg': 25.6,
            'mmg': 25.6
        },
        {
            'symbol': 'mg',
            'element': 'Magnesium',
            'AtomicWeight': 24.305,
            'density': 1.738,
            'Valence': 2,
            '1meq': 12,
            '1mm': 24,
            '1mmequals': 2,
            'meqg': 83.3,
            'mmg': 41.6
        },
        {
            'symbol': 'ca',
            'element': 'Calcium',
            'AtomicWeight': 40.078,
            'density': 1.54,
            'Valence': 2,
            '1meq': 20,
            '1mm': 40,
            '1mmequals': 2,
            'meqg': 50,
            'mmg': 25
        },
        {
            'symbol': 'p',
            'element': 'Phosphorus',
            'AtomicWeight': 30.973762,
            'density': 1.82,
            'Valence': 1.8,
            '1meq': 17.2,
            '1mm': 31,
            '1mmequals': 1.8,
            'meqg': 58.1,
            'mmg': 32.2
        }
    ];

    static Gender: Array<any> = [
      {'id': 0, 'sex': 'female'},
      {'id': 1, 'sex': 'male'},
      {'id': 2, 'sex': 'other'}
    ];
      constructor () {}



    }
