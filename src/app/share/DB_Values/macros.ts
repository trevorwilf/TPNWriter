

export interface IMacros {
  calEquation: string;
  energyrequirement?: number;
  energyrequirementgoal?: number;
  energyrequirementperkg?: number;
  energyrequirementMin?: number;
  energyrequirementMax?: number;
  useGIR: boolean;
  GIR?: number;
  dextrose?: number;

  proteingoalMin?: number;
  proteingoalMax?: number;
  proteingoal?: number;
  protein?: number;
  proteinperkg?: number;
  cystein?: number;

  lipidsgoalMin?: number;
  lipidsgoalMax?: number;
  lipidsgoal?: number;
  lipids?: number;
  lipidsperkg?: number;
  lipidSource: string;
  lipidPercent: number;
  carbs?: number;
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
    {'id': 1, 'percent': '20', 'longname': '20', 'default' : '0'},
    {'id': 2, 'percent': '30', 'longname': '30', 'default' : '0'},
    {'id': 3, 'percent': '40', 'longname': '40', 'default' : '0'}
  ];

  constructor () {}



}
