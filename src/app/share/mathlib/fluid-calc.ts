import { Component } from '@angular/core';
import { IFluids } from '../../share/DB_Values/fluids';

export class FluidCalc {

  static initialfluidVol(dosingWeight: number) {
    // expect all weights to be in kg coming in
    // https://health.csusb.edu/dchen/368%20stuff/TPN%20calculation.htm
    // https://www.utmb.edu/Pedi_Ed/CoreV2/Fluids/Fluids4.html
    // Based on the Holliday-Segar method for calculating maintenance fluid requirements in children.
    // let newweight: number = dosingWeight / 1000;
    let stageweight: number = null;
    let returnvol = 0;
    if (dosingWeight - 20 > 0) {
      stageweight = dosingWeight - 20;
      returnvol = 1500 + 20 * stageweight;
      if (returnvol > 3500) {
        return 3500;
      } else {
        return returnvol;
      }
    } else {
      if (dosingWeight - 10 > 0) {
        stageweight = dosingWeight - 10;
        returnvol = 1000 + 50 * stageweight;
        return returnvol;
      } else {
        if (dosingWeight - 3.5 > 0) {
          stageweight = dosingWeight;
          returnvol = 100 * stageweight;
          return returnvol;
        } else {
        // need to verify with Serena
        stageweight = dosingWeight;
        returnvol = 115 * stageweight;
        return returnvol;
        }
      }
    }
  }






       }

