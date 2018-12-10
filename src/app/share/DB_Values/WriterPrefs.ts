

export interface IWriterPrefs {

  bodyweightunits?: string;

  // Observation Liquids
  urineunits?: string;
  gilossunits?: string;
  enteralVolumeunits?: string;

  // Observation Labs
  sodiumunitslab?: string;
  potassiumunitslab?: string;
  chlorideunitslab?: string;
  bicorbonateunitslab?: string;
  BUNunitslab?: string;
  creatineunitslab?: string;
  glucoseunitslab?: string;
  calciumunitslab?: string;
  phosphateunitslab?: string;
  magnesiumunitslab?: string;
  preabluminunitslab?: string;
  albuminunitslab?: string;
  triglyceridesunitslab?: string;

  // fluids
  dripVolumeunit?: number;
  fluidVolumeunit?: number;

  // calculations
  calEquation: string;
  useGIR: boolean;
  lipidSource: string;
  aasSource: string;
  dextroseSource: string;

  // electrolytes
  sodiumunit: string;
  potassiumunit: string;
  calciumunit: string;
  phosphorusunit: string;
  acetateunit: string;
  magnesiumunit: string;

  timestamp?: number;
  }
