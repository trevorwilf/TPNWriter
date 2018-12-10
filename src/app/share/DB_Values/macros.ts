

export interface IMacros {
  calEquation: string;
  energyrequirement?: number;
  energyrequirementperkg?: number;
  energyrequirementgoal?: number;
  energyrequirementperkggoal?: number;
  energyrequirementMin?: number;
  energyrequirementMax?: number;
  useGIR: boolean;
  GIR?: number;
  dextrose?: number;
  dextroseSource?: number;
  dextrosePercent?: number;
  dextrosemOsm_L?: number;

  proteingoalMin?: number;
  proteingoalMax?: number;
  proteingoal?: number;
  protein?: number;
  proteinperkg?: number;
  cystein?: number;
  glutamate?: number;
  aasSource: string;
  aasPercent: number;
  aasmOsm_L: number;

  lipidsgoalMin?: number;
  lipidsgoalMax?: number;
  lipidsgoal?: number;
  lipids?: number;
  lipidsperkg?: number;
  lipidSource: string;
  lipidPercent: number;
  lipidmOsm_L: number;

  carbs?: number;
  carbsgoal?: number;
  notes: string;

  aassolvol?: number;
  lipidsolvol?: number;
  carbsolvol?: number;
  aasmOsm?: number;
  lipidmOsm?: number;
  carbmOsm?: number;
  aasfinalconcentration?: number;
  lipidfinalconcentration?: number;
  carbfinalconcentration?: number;
  mOsm_L?: number;
  totalvolofmacros?: number;

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
    {'id': 0, 'name': 'Omegaven 10%', 'longname': 'Omegaven 10%' , 'percent': '10', 'default': '1', 'mOsm_L': '273'},
    {'id': 1, 'name': 'Smoflipid 20%', 'longname': 'Smoflipid 20%' , 'percent': '20', 'default': '0', 'mOsm_L': '270'},
    {'id': 2, 'name': 'Nutrilipid 20%', 'longname': 'Nutrilipid 20%' , 'percent': '20', 'default': '0', 'mOsm_L': '270'},
    {'id': 3, 'name': 'Intralipid 10%', 'longname': 'Intralipid 10%' , 'percent': '10', 'default': '0', 'mOsm_L': '260'},
    {'id': 4, 'name': 'Intralipid 20%', 'longname': 'Intralipid 20%' , 'percent': '20', 'default': '0', 'mOsm_L': '260'},
    {'id': 5, 'name': 'Intralipid 30%', 'longname': 'Intralipid 30%' , 'percent': '30', 'default': '0', 'mOsm_L': '260'},
    {'id': 6, 'name': 'Intralipid 40%', 'longname': 'Intralipid 40%' , 'percent': '40', 'default': '0', 'mOsm_L': '260'}
  ];

  static aassource: Array<any> = [
    {'id': 0, 'name': 'TrophAmine 6%', 'longname': 'TrophAmine 6%' , 'percent': '6', 'default': '0', 'mOsm_L': '525'},
    {'id': 1, 'name': 'TrophAmine 10%', 'longname': 'TrophAmine 10%' , 'percent': '10', 'default': '1', 'mOsm_L': '875'},
    {'id': 2, 'name': 'FreAmine HBC 6.9%', 'longname': 'FreAmine HBC 6.9%' , 'percent': '6.9', 'default': '0', 'mOsm_L': '550'},
    {'id': 3, 'name': 'HepatAmine 8%', 'longname': 'HepatAmine 8%' , 'percent': '8', 'default': '0', 'mOsm_L': '785'},
    {'id': 4, 'name': 'NephrAmine 5.4%', 'longname': 'NephrAmine 5.4%' , 'percent': '5.4', 'default': '0', 'mOsm_L': '500'},
    {'id': 5, 'name': 'AminoSyn II 10%', 'longname': 'AminoSyn II 10%' , 'percent': '10', 'default': '0', 'mOsm_L': '870'},
    {'id': 6, 'name': 'AminoSyn II 15%', 'longname': 'AminoSyn II 15%' , 'percent': '15', 'default': '0', 'mOsm_L': '1500'},
    {'id': 7, 'name': 'Travasol 10%', 'longname': 'Travasol 10%' , 'percent': '10', 'default': '0', 'mOsm_L': '998'},
    {'id': 8, 'name': 'AAS 10%', 'longname': 'AAS 10%' , 'percent': '10', 'default': '0', 'mOsm_L': '870'},
    {'id': 9, 'name': 'AAS 15%', 'longname': 'AAS 15%' , 'percent': '15', 'default': '0', 'mOsm_L': '1500'}
  ];

  static dextrosesource: Array<any> = [
    {'id': 0, 'name': 'Dextrose 2.5%', 'longname': 'Dextrose 2.5%' , 'percent': '2.5', 'default': '0', 'mOsm_L': '126.25'},
    {'id': 1, 'name': 'Dextrose 5%', 'longname': 'Dextrose 5%' , 'percent': '5', 'default': '0', 'mOsm_L': '252.5'},
    {'id': 2, 'name': 'Dextrose 10%', 'longname': 'Dextrose 10%' , 'percent': '10', 'default': '0', 'mOsm_L': '505'},
    {'id': 3, 'name': 'Dextrose 20%', 'longname': 'Dextrose 20%' , 'percent': '20', 'default': '0', 'mOsm_L': '1010'},
    {'id': 4, 'name': 'Dextrose 30%', 'longname': 'Dextrose 30%' , 'percent': '30', 'default': '0', 'mOsm_L': '1515'},
    {'id': 5, 'name': 'Dextrose 40%', 'longname': 'Dextrose 40%' , 'percent': '40', 'default': '0', 'mOsm_L': '2020'},
    {'id': 6, 'name': 'Dextrose 50%', 'longname': 'Dextrose 50%' , 'percent': '50', 'default': '1', 'mOsm_L': '2525'},
    {'id': 5, 'name': 'Dextrose 70%', 'longname': 'Dextrose 70%' , 'percent': '70', 'default': '0', 'mOsm_L': '3535'}
  ];

  constructor () {}



}
