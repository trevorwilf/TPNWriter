

export interface IPatientObservations {
  date: number;
  tpndayNumber: number;
  bodyweight?: number;
  bodyweightunits?: string;
  bodyweightdiff?: number;
  urine?: number;
  urineunits?: string;
  giloss?: number;
  gilossunits?: string;

  // enteral feeds
  useEnteral: boolean;
  enteralcalDensity: number;
  enteralProtein: number;
  enteralLipid: number;
  enteralCarb: number;
  enteralVolume: number;
  enteralVolumeunits?: string;
  enteralFormula: number;

  // labs 13 total
  sodiumlab?: number;
  sodiumunitslab?: string;
  potassiumlab?: number;
  potassiumunitslab?: string;
  chloridelab?: number;
  chlorideunitslab?: string;
  bicorbonatelab?: number;
  bicorbonateunitslab?: string;
  BUNlab?: number;
  BUNunitslab?: string;
  creatinelab?: number;
  creatineunitslab?: string;
  glucoselab?: number;
  glucoseunitslab?: string;
  calciumlab?: number;
  calciumunitslab?: string;
  phosphatelab?: number;
  phosphateunitslab?: string;
  magnesiumlab?: number;
  magnesiumunitslab?: string;
  preabluminlab?: number;
  preabluminunitslab?: string;
  albuminlab?: number;
  albuminunitslab?: string;
  triglycerideslab?: number;
  triglyceridesunitslab?: string;

  notes: string;
  required: boolean;
  }
