
import {debounceTime,  catchError, tap, map } from 'rxjs/operators';
import { Component, OnInit, ElementRef, Output } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/primeng';

import { BehaviorSubject ,  Subscription ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';






import { ErrorService } from '../../share/debug/error.service';

// custom math library
import { patientdemographicscalc } from '../../share/mathlib/patient-calc';
import { MacroNutrient } from '../../share/mathlib/formula-macronutrient';
import { FluidCalc } from '../../share/mathlib/fluid-calc';
import { MathConversions } from '../../share/mathlib/math-conversions';

// freetpn services
import { IIVRoutesService } from '../freetpnshare/ivroute.service';
import { FreeTPNDataService } from '../freetpnshare/freetpndata.service';
import { StressorsService } from '../freetpnshare/stressor.service';
import { BabyFormulaService } from '../freetpnshare/babyformula.service';

// Interfaces
import { IPatient } from '../../share/DB_Values/patient-interface';
import { IIVRoutes } from '../../share/DB_Values/IVRoute';
import { IPatientObservations } from '../../share/DB_Values/observations-interface';
import { IElectrolyte, Electrolytedetail } from '../../share/DB_Values/Electrolytes';
import { Stressors } from '../../share/DB_Values/Stressor';
import { IFluids, Fluidstable } from '../../share/DB_Values/fluids';
import { IMacros, Macrotable } from '../../share/DB_Values/macros';
import { IAdditive, Additivedetail } from '../../share/DB_Values/additives';
import { Unitstable } from '../../share/DB_Values/Units';
import { IWriterPrefs } from '../../share/DB_Values/WriterPrefs';

@Component({
  selector: 'app-macros',
  templateUrl: './macros.component.html',
  styleUrls: ['./macros.component.css']
})

export class MacrosinfoComponent implements OnInit {

  PatientInfo: IPatient;
  TodaysInfo: IPatientObservations;
  FluidsInfo: IFluids;
  userPrefs: IWriterPrefs;
  electrolyteInfo: IElectrolyte;
  additiveInfo: IAdditive;
  macroInfo: IMacros;

  weightunits: any;
  volumeunits: any;
  calorieunits: any;
  electorlyteunits: any;
  electorlytlabseunits: any;
  genderlist: any;
  macrocal: any;

  MacrosInfo: FormGroup;
  energyequationlist: any;
  carbsourcelist: any;
  lipidsourcelist: any;
  lipidPercentlist: any;

  constructor(
    private formData: FreeTPNDataService,
    private stressorservice: StressorsService,
    private _formBuilder: FormBuilder,
    private _err: ErrorService
  ) {}

  ngOnInit() {

    this.weightunits = Unitstable.weightunits;
    this.volumeunits = Unitstable.volumeunits;
    this.calorieunits = Unitstable.calorieunits;
    this.electorlyteunits = Unitstable.electorlyteunits;
    this.electorlytlabseunits = Unitstable.electorlytlabseunits;
    this.genderlist = Unitstable.Gender;
    this.macrocal = Unitstable.MacroCals;

    this.energyequationlist = Macrotable.energyequation;
    this.carbsourcelist = Macrotable.carbsource;
    this.lipidsourcelist = Macrotable.lipidsource;
    this.lipidPercentlist = Macrotable.lipidPercent;

    this.MacrosInfo = this._formBuilder.group({

      energyrequirement: [''],
      energyrequirementgoal: [''],
      energyrequirementMin: [''],
      energyrequirementMax: [''],
      energyrequirementperkg: [],
      GIR: ['', Validators.required],
      dextrose: ['', Validators.required],

      proteingoalMin: ['', Validators.required],
      proteingoalMax: [''],
      proteingoal: ['', Validators.required],
      protein: ['', Validators.required],
      proteinperkg: ['', Validators.required],
      cystein: [''],

      lipidsgoalMin: ['', Validators.required],
      lipidsgoalMax: ['', Validators.required],
      lipidsgoal: ['', Validators.required],
      lipids: ['', Validators.required],
      lipidsperkg: ['', Validators.required],

      carbs: ['', Validators.required],

      // user prefs
      calEquation: [this.energyequationlist.find(x => x.default === '1').longname, Validators.required],
      useGIR: [this.carbsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidSource: [this.lipidsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidPercent: [this.lipidPercentlist.find(x => x.default === '1').longname, Validators.required],

      required: [false]
    });

    /////////////////////////////////////
    // changes due to external forms
    this.formData.CurrentUserPrefInfo.pipe(debounceTime(500)).subscribe(data => {
      this.userPrefs = data;
      if (data) {
          for (const element in data) {
            if (this.MacrosInfo.controls[element]) {
              if (this.MacrosInfo.controls[element].pristine) {
                // console.log(element, this.userPrefs[element]);
                if (this.userPrefs[element].length > 0) {
                  this.MacrosInfo.controls[element].patchValue(this.userPrefs[element]);
                  this.MacrosInfo.controls[element].markAsPristine();
                }
              }
            }
          }
      }
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentPatientInfo.subscribe(data => {
      this.PatientInfo = data;

      // get Energy need estimate, protein goal
      if (data && this.FluidsInfo) {
        if (Number.isInteger(data.yearsofLife) && this.FluidsInfo.dosingWeight) {
          if (data.yearsofLife > 18) {
            if (data.height ) {
              this.updateeneargyneeds(data, this.FluidsInfo);
            }
          } else {
              this.updateeneargyneeds(data, this.FluidsInfo);
          }

          this.updateproteingoal(data, this.FluidsInfo);
        }
      }

      // get lipid goal
      if (data && this.FluidsInfo && this.TodaysInfo && this.macroInfo) {

        if (this.PatientInfo.daysofLife
              && this.FluidsInfo.dosingWeight
              && this.macroInfo.energyrequirementgoal
              && this.TodaysInfo.tpndayNumber) {
                this.updatelipidgoal(this.PatientInfo,
                  this.FluidsInfo,
                  this.MacrosInfo,
                  this.TodaysInfo);
        }
      }

    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentTodaysInfo.subscribe(data => {
      this.TodaysInfo = data;

      // get lipid goal
      if (data && this.PatientInfo && this.FluidsInfo && this.macroInfo) {
        if (this.PatientInfo.daysofLife
              && this.FluidsInfo.dosingWeight
              && this.macroInfo.energyrequirementgoal
              && this.TodaysInfo.tpndayNumber ) {
                this.updatelipidgoal(this.PatientInfo,
                  this.FluidsInfo,
                  this.MacrosInfo,
                  this.TodaysInfo);
        }
      }
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentFluidsInfo.subscribe(data => {
      this.FluidsInfo = data;

      // update energy needs
      if (data && this.PatientInfo) {
        if (data.dosingWeight && Number.isInteger(this.PatientInfo.yearsofLife)) {
          if (this.PatientInfo.yearsofLife > 18) {
            if (this.PatientInfo.height ) {
              this.updateeneargyneeds(this.PatientInfo, data);
            }
          } else {
              this.updateeneargyneeds(this.PatientInfo, data);
          }
          this.updateproteingoal(this.PatientInfo, data);

        }
      }

      // get lipid goal
      if (this.MacrosInfo.controls['lipidsperkg'].pristine) {
        if (data && this.PatientInfo && this.TodaysInfo && this.macroInfo) {
          if (this.PatientInfo.daysofLife
                && this.FluidsInfo.dosingWeight
                && this.macroInfo.energyrequirementgoal
                && this.TodaysInfo.tpndayNumber ) {
                  this.updatelipidgoal(this.PatientInfo,
                    this.FluidsInfo,
                    this.MacrosInfo,
                    this.TodaysInfo);
          }
        }
      }

    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentElectrolyteInfo.subscribe(data => {
      this.electrolyteInfo = data;
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentAdditiveInfo.subscribe(data => {
      this.additiveInfo = data;
    },
    catchError(this._err.handleError)
    );


    ////////////////////////////////////
    // Dynamic internal changes
    this.MacrosInfo.valueChanges
      .subscribe(data => {

        // flip required fields if all fields are valid
        if (this.MacrosInfo.valid !== this.MacrosInfo.controls['required'].value) {
          this.MacrosInfo.controls['required'].patchValue(this.MacrosInfo.valid.valueOf());
          data.required = this.MacrosInfo.valid.valueOf();
        }

        this.updateMacrosInfo(data);
    },
    catchError(this._err.handleError)
    );

    // get lipid goal
    this.MacrosInfo.valueChanges.pipe(
      debounceTime(10))
      .subscribe(data => {

      if (this.MacrosInfo.controls['lipids'].pristine) {
        if (data && this.FluidsInfo && this.TodaysInfo && this.PatientInfo) {
          console.log('lipid goal');
          console.log(data.energyrequirement);
          if ((this.PatientInfo.daysofLife)
                && (this.FluidsInfo.dosingWeight)
                && (data.energyrequirementgoal)
                && (this.TodaysInfo.tpndayNumber) ) {
                  this.updatelipidgoal(this.PatientInfo,
                    this.FluidsInfo,
                    this.MacrosInfo,
                    this.TodaysInfo);
          }
        }
      }

    },
    catchError(this._err.handleError)
    );

    // calculate carb goals
    this.MacrosInfo.valueChanges.pipe(
      debounceTime(20))
      .subscribe(data => {

        if (data.energyrequirementgoal
            && data.protein
            && data.lipids) {
              this.updatecarbgoal(data);
        }

    },
    catchError(this._err.handleError)
    );

    // flips GIR and Dextrose Calc
    this.MacrosInfo.controls['useGIR'].valueChanges.pipe(
     debounceTime(0))
     .subscribe(data => {
        if (this.MacrosInfo.controls['useGIR'].value === 'GIR') {
          if (this.FluidsInfo &&
              this.MacrosInfo.controls['GIR'].value) {
                if (this.FluidsInfo.dosingWeight &&
                    this.FluidsInfo.fluidVolume) {
                  this.MacrosInfo.controls['dextrose'].markAsPristine();
                  this.MacrosInfo.controls['dextrose'].patchValue(
                    MacroNutrient.GIRtoDextros(this.FluidsInfo.fluidVolume,
                      this.MacrosInfo.controls['GIR'].value,
                      this.FluidsInfo.dosingWeight)
                    );
                }
            }
        } else {
          if (this.FluidsInfo &&
            this.MacrosInfo.controls['dextrose'].value) {
              if (this.FluidsInfo.dosingWeight &&
                  this.FluidsInfo.fluidVolume) {
                this.MacrosInfo.controls['GIR'].markAsPristine();
                this.MacrosInfo.controls['GIR'].patchValue(
                  MacroNutrient.dextrosetoGIR(this.FluidsInfo.fluidVolume,
                                              this.MacrosInfo.controls['dextrose'].value,
                                              this.FluidsInfo.dosingWeight)
                );
            }
          }
        }
     },
     catchError(this._err.handleError)
     );

     this.MacrosInfo.controls['GIR'].valueChanges.pipe(
     debounceTime(0))
     .subscribe(data => {
          if (this.FluidsInfo &&
              !this.MacrosInfo.controls['GIR'].pristine &&
              this.MacrosInfo.controls['GIR'].value) {
                if (this.FluidsInfo.dosingWeight &&
                    this.FluidsInfo.fluidVolume) {
                  this.MacrosInfo.controls['dextrose'].markAsPristine();
                  this.MacrosInfo.controls['dextrose'].patchValue(
                        MacroNutrient.GIRtoDextros(this.FluidsInfo.fluidVolume,
                          this.MacrosInfo.controls['GIR'].value,
                          this.FluidsInfo.dosingWeight)
                        );
               }
            }
     },
     catchError(this._err.handleError)
     );

     this.MacrosInfo.controls['dextrose'].valueChanges.pipe(
     debounceTime(0))
     .subscribe(data => {
          if (this.FluidsInfo &&
              !this.MacrosInfo.controls['dextrose'].pristine &&
              this.MacrosInfo.controls['dextrose'].value) {
                if (this.FluidsInfo.dosingWeight &&
                    this.FluidsInfo.fluidVolume) {
                  this.MacrosInfo.controls['GIR'].markAsPristine();
                  this.MacrosInfo.controls['GIR'].patchValue(
                        MacroNutrient.dextrosetoGIR(this.FluidsInfo.fluidVolume,
                                                    this.MacrosInfo.controls['dextrose'].value,
                                                    this.FluidsInfo.dosingWeight)
                  );

                }
            }
     },
     catchError(this._err.handleError)
     );

     //this.MacrosInfo.controls['required']
     // .valueChanges.pipe(
     // debounceTime(200))
     // .subscribe(data => {
     //   this.MacrosInfo.controls['required'].patchValue(this.MacrosInfo.valid);
     //},
     //catchError(this._err.handleError)
     //);



  }


  updateeneargyneeds(pinfo, finfo): void {

    const weight = MathConversions.converttokgs(finfo.dosingWeight, this.weightunits.find(x => x.longname === finfo.bodyweightunits).tokg);
    const cm = pinfo.height;
    const ageinyears = pinfo.yearsofLife;
    const gender = pinfo.gender;
    // const equation = this.energyequationlist.find(x => x.longname === this.userPrefs.calEquation).id;
    const equation = this.energyequationlist.find(x => x.longname === this.MacrosInfo.controls['calEquation'].value).id;
    const accuracy = 2;

    let x = patientdemographicscalc.reeenergyneeds(
      weight, cm, ageinyears, gender, equation, accuracy) * .9 ;
    if (x !== this.MacrosInfo.controls['energyrequirementMin'].value) {
      this.MacrosInfo.controls['energyrequirementMin'].patchValue(x);
    }

    x = patientdemographicscalc.reeenergyneeds(
      weight, cm, ageinyears, gender, equation, accuracy) * 1.1 ;
    if (x !== this.MacrosInfo.controls['energyrequirementMax'].value) {
      this.MacrosInfo.controls['energyrequirementMax'].patchValue(x);
    }

    if (this.MacrosInfo.controls['energyrequirementgoal'].pristine) {
      x = patientdemographicscalc.reeenergyneeds(
        weight, cm, ageinyears, gender, equation, accuracy);
      if (x !== this.MacrosInfo.controls['energyrequirementgoal'].value) {
          this.MacrosInfo.controls['energyrequirementgoal'].patchValue(x);
      }
    }

    x = patientdemographicscalc.calgoalperkg(
      this.MacrosInfo.controls['energyrequirementgoal'].value, weight, accuracy);
    if (x !== this.MacrosInfo.controls['energyrequirementperkg'].value) {
      this.MacrosInfo.controls['energyrequirementperkg'].patchValue(x);
    }

      // console.log('####################');
      // console.log(equation);
      // console.log(ageinyears);
      // console.log(this.MacrosInfo.controls['energyrequirementMin'].value)
  }

  updatelipidgoal(pinfo, finfo, minfo, tinfo): void {
      const weight = MathConversions
                .converttokgs(finfo.dosingWeight,
                        this.weightunits
                        .find(x => x.longname === finfo.bodyweightunits).tokg);

      let y = MacroNutrient.getlipidgoalgm(weight,
                        pinfo.daysofLife,
                        minfo.energyrequirementgoal,
                        tinfo.tpndayNumber );

      console.log('lipid goal');
      console.log(y);
      y = MathConversions.roundtoaccuracy(y);

      if (y !== this.MacrosInfo.controls['lipidsgoal'].value) {
        this.MacrosInfo.controls['lipidsgoal'].patchValue(y);
        if (this.MacrosInfo.controls['lipidsperkg'].pristine) {
          const ykg = MathConversions.roundtoaccuracy(y / this.FluidsInfo.dosingWeight);
          this.MacrosInfo.controls['lipidsperkg'].patchValue(ykg);
        }
        if (this.MacrosInfo.controls['lipids'].pristine) {
          this.MacrosInfo.controls['lipids'].patchValue(y);
        }
      }

   }

    updatecarbgoal(minfo): void {
      const totalcals = minfo.energyrequirementgoal;
      const protein = minfo.proteingoal;
      const proteincal = Unitstable.MacroCals.find(x => x.longname === 'protein');
      const lipids = minfo.lipidsgoal;
      const lipidscal = Unitstable.MacroCals.find(x => x.longname === 'lipid');
      const carbcal = Unitstable.MacroCals.find(x => x.longname === 'carb');

      let y = MacroNutrient.getxgms(totalcals,
                  protein, proteincal.value,
                  lipids, lipidscal.value,
                  carbcal.value);
      y = MathConversions.roundtoaccuracy(y);

      if (y !== this.MacrosInfo.controls['carbs'].value) {
        this.MacrosInfo.controls['carbs'].patchValue(y);
      }

  }

  // protein
  updateproteingoal(pinfo, finfo): void {
    const weight = MathConversions.converttokgs(finfo.dosingWeight, this.weightunits.find(x => x.longname === finfo.bodyweightunits).tokg);
    const ageinyears = pinfo.yearsofLife;
    const daysofLife = pinfo.daysofLife;
    const accuracy = 2;
    let x = 0;

      x = MacroNutrient.getproteingoal(
        weight, daysofLife, ageinyears);
      if (x !== this.MacrosInfo.controls['proteingoal'].value) {
          this.MacrosInfo.controls['proteingoal'].patchValue(x);
      }

    if (this.MacrosInfo.controls['proteinperkg'].pristine) {
      x = MacroNutrient.getproteingoal(
        weight, daysofLife, ageinyears);
      x = MathConversions.roundtoaccuracy(x / weight);
      if (x !== this.MacrosInfo.controls['proteinperkg'].value) {
          this.MacrosInfo.controls['proteinperkg'].patchValue(x);
      }
    }

    if (this.MacrosInfo.controls['protein'].pristine) {
      x = MacroNutrient.getproteingoal(
        weight, daysofLife, ageinyears);
      x = MathConversions.roundtoaccuracy(x);
      if (x !== this.MacrosInfo.controls['protein'].value) {
          this.MacrosInfo.controls['protein'].patchValue(x);
      }
    }

  }

  updateproteinbytotal(minfo): void {



  }

  updateproteinbykg(minfo): void {



  }

  updateMacrosInfo(info: IMacros): void {
    // this.formData.changeMacrosInfoSource(info.getRawValue());
    this.formData.changeMacrosInfoSource(info);
    // console.log('## updatemacros  ##');
    // console.log(info.getRawValue());
    // console.log(info);
    // console.log(this.formData.CurrentMacrosInfo);
    // this.formData.CurrentMacrosInfo.map(x => console.log(x));
  }


  hasFormErrors() {
    return !this.MacrosInfo.valid;
  }

  // writetoconsolepi(info) {
  //   console.log(info.getRawValue());
  // }
}
