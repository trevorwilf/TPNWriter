

export interface IFluids {
  dosingWeight?: number;
  bodyweightunits?: string;
  use5Dayprotocol?: boolean;
  useDrips?: boolean;
  useEnteral?: boolean;
  dripVolume?: number;
  dripVolumeunit?: number;
  enteralVolume?: number;
  enteralVolumeunit?: number;
  fluidVolume?: number;
  fluidVolumeunit?: number;
  fluidRate?: number;
  notes: string;

  required: boolean;
}

export interface IfluidReq {
  dosingweight?: boolean;
  DOB?: boolean;
}

export class Fluidstable {

// ml/kg/day
  static firstweekprotocol: Array<any> = [
    {'id': 0, 'ml': '60'},
    {'id': 1, 'ml': '60'},
    {'id': 2, 'ml': '80'},
    {'id': 3, 'ml': '100'},
    {'id': 4, 'ml': '120'},
    {'id': 5, 'ml': '140'},
    {'id': 6, 'ml': '160'},
    {'id': 7, 'ml': '180'}
  ];

  constructor () {}



}
