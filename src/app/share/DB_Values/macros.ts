

export interface IMacros {
  calEquation: string;
  energyrequirementMin: number;
  energyrequirementMax: number;
  useGIR: boolean;
  GIR: number;
  dextrose: number;
  proteingoalMin: number;
  proteingoalMax: number;
  protein: number;
  cystein: number;
  lipids: number;
  lipidSource: string;
  lipidPercent: number;
  carbs: number;
  notes: string;

  required: boolean;
}

export class Macrotable {

  static energyequation: Array<any> = [
    {'id': 0, 'name': 'Harris-Benedict', 'longname': 'Harris-Benedict', 'default' : '1'},
    {'id': 1, 'name': 'Roza and Shizgal', 'longname': 'Roza and Shizgal', 'default' : '0'},
    {'id': 2, 'name': 'Mifflin and St Jeor', 'longname': 'Mifflin and St Jeor', 'default' : '0'}
  ];

  static carbsource: Array<any> = [
    {'id': 0, 'name': 'GIR', 'longname': 'GIR', 'default' : '1'},
    {'id': 1, 'name': 'Dextrose', 'longname': 'Dextrose', 'default' : '0'}
  ];

  static lipidsource: Array<any> = [
    {'id': 0, 'name': 'Smoflipid', 'longname': 'Smoflipid', 'default' : '1'},
    {'id': 1, 'name': 'Intralipid', 'longname': 'Intralipid', 'default' : '0'}
  ];

  static lipidPercent: Array<any> = [
    {'id': 0, 'percent': '10', 'longname': '10', 'default' : '1'},
    {'id': 1, 'percent': '20', 'longname': '20', 'default' : '0'}
  ];

  constructor () {}



}
