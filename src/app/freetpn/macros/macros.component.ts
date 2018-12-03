
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
      energyrequirementperkg: [''],
      energyrequirementgoal: [''],
      energyrequirementperkggoal: [''],
      energyrequirementMin: [''],
      energyrequirementMax: [''],
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
      carbsgoal: ['', Validators.required],

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
        if (Number.isInteger(data.yearsofLife) && this.FluidsInfo.dosingWeightkg) {
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
              && this.FluidsInfo.dosingWeightkg
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
              && this.FluidsInfo.dosingWeightkg
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
        if (data.dosingWeightkg && Number.isInteger(this.PatientInfo.yearsofLife)) {
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
                && this.FluidsInfo.dosingWeightkg
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
          console.log(data.energyrequirementgoal);
          if ((this.PatientInfo.daysofLife)
                && (this.FluidsInfo.dosingWeightkg)
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

        if (this.FluidsInfo) {
          if (this.FluidsInfo.dosingWeightkg
              && data.energyrequirementgoal
              && data.protein
              && data.lipids) {
                this.updatecarbgoal(data, this.FluidsInfo);
          }
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
                if (this.FluidsInfo.dosingWeightkg &&
                    this.FluidsInfo.fluidVolume) {
                  this.MacrosInfo.controls['dextrose'].markAsPristine();
                  this.MacrosInfo.controls['dextrose'].patchValue(
                    MacroNutrient.GIRtoDextros(this.FluidsInfo.fluidVolume,
                      this.MacrosInfo.controls['GIR'].value,
                      this.FluidsInfo.dosingWeightkg)
                    );
                }
            }
        } else {
          if (this.FluidsInfo &&
            this.MacrosInfo.controls['dextrose'].value) {
              if (this.FluidsInfo.dosingWeightkg &&
                  this.FluidsInfo.fluidVolume) {
                this.MacrosInfo.controls['GIR'].markAsPristine();
                this.MacrosInfo.controls['GIR'].patchValue(
                  MacroNutrient.dextrosetoGIR(this.FluidsInfo.fluidVolume,
                                              this.MacrosInfo.controls['dextrose'].value,
                                              this.FluidsInfo.dosingWeightkg)
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
                if (this.FluidsInfo.dosingWeightkg &&
                    this.FluidsInfo.fluidVolume) {

                  this.MacrosInfo.controls['carbs'].markAsDirty();
                  this.MacrosInfo.controls['carbs'].markAsTouched();

                  this.MacrosInfo.controls['dextrose'].markAsPristine();
                  this.MacrosInfo.controls['dextrose'].patchValue(
                        MacroNutrient.GIRtoDextros(this.FluidsInfo.fluidVolume,
                          this.MacrosInfo.controls['GIR'].value,
                          this.FluidsInfo.dosingWeightkg)
                        );

                  this.MacrosInfo.controls['carbs'].patchValue(
                    MacroNutrient.GIRtodextrosegm(this.MacrosInfo.controls['GIR'].value,
                      this.FluidsInfo.dosingWeightkg));

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
                if (this.FluidsInfo.dosingWeightkg &&
                    this.FluidsInfo.fluidVolume) {
                  this.MacrosInfo.controls['GIR'].markAsPristine();
                  this.MacrosInfo.controls['GIR'].patchValue(
                        MacroNutrient.dextrosetoGIR(this.FluidsInfo.fluidVolume,
                                                    this.MacrosInfo.controls['dextrose'].value,
                                                    this.FluidsInfo.dosingWeightkg)
                  );

                }
            }
     },
     catchError(this._err.handleError)
     );

     // dynamic carb
     this.MacrosInfo.controls['carbs'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {
        if (!this.MacrosInfo.controls['carbs'].pristine) {
          console.log('carbs ree triggered');
          console.log(data);
          // update protein and ree
          if (this.MacrosInfo.controls['lipids'].value &&
              this.MacrosInfo.controls['protein'].value) {
            this.updatereetotal(this.MacrosInfo.controls['protein'].value,
                              this.MacrosInfo.controls['lipids'].value,
                              this.MacrosInfo.controls['carbs'].value);
          }
        }
      },
      catchError(this._err.handleError)
      );

     // dynamic protein
     this.MacrosInfo.controls['proteinperkg'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {
        if (!this.MacrosInfo.controls['proteinperkg'].pristine) {
          console.log('protein per kg triggered');
          console.log(data);
          // update protein and ree
          if (this.MacrosInfo.controls['lipids'].value &&
              this.MacrosInfo.controls['carbs'].value &&
              this.FluidsInfo.dosingWeightkg ) {
            this.updateproteinbykg(data, this.MacrosInfo.controls['lipids'].value,
                        this.MacrosInfo.controls['carbs'].value, this.FluidsInfo);
          }
        }
      },
      catchError(this._err.handleError)
      );

      this.MacrosInfo.controls['protein'].valueChanges.pipe(
        debounceTime(0))
        .subscribe(data => {

      },
      catchError(this._err.handleError)
      );

    // dynamic lipids
    this.MacrosInfo.controls['lipidsperkg'].valueChanges.pipe(
      debounceTime(0))
        .subscribe(data => {
          if (!this.MacrosInfo.controls['lipidsperkg'].pristine) {
            console.log('lipid per kg triggered');
            console.log(data);
            // update protein and ree
            if (this.MacrosInfo.controls['protein'].value &&
                this.MacrosInfo.controls['carbs'].value &&
                this.FluidsInfo.dosingWeightkg ) {
              this.updatelipidbykg(this.MacrosInfo.controls['protein'].value, data,
                          this.MacrosInfo.controls['carbs'].value, this.FluidsInfo);
            }
          }
    },
    catchError(this._err.handleError)
    );

    this.MacrosInfo.controls['lipids'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {

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

    const weight: number = finfo.dosingWeightkg;
    const cm = pinfo.height;
    const ageinyears = pinfo.yearsofLife;
    const gender = pinfo.gender;
    // const equation = this.energyequationlist.find(x => x.longname === this.userPrefs.calEquation).id;
    const equation = this.energyequationlist.find( x => x.longname === this.MacrosInfo.controls['calEquation'].value).id;
    const accuracy = 2;

    // min goal
    let x = MathConversions.roundtoaccuracy(patientdemographicscalc.reeenergyneeds(
                weight, cm, ageinyears, gender, equation, accuracy) * .9);
    console.log(x);
    if (x !== this.MacrosInfo.controls['energyrequirementMin'].value) {
      this.MacrosInfo.controls['energyrequirementMin'].patchValue(x);
    }

    // max goal
    x = MathConversions.roundtoaccuracy(patientdemographicscalc.reeenergyneeds(
                weight, cm, ageinyears, gender, equation, accuracy) * 1.1) ;
    if (x !== this.MacrosInfo.controls['energyrequirementMax'].value) {
      this.MacrosInfo.controls['energyrequirementMax'].patchValue(x);
    }

    // medium goal
    if (this.MacrosInfo.controls['energyrequirementgoal'].pristine) {
      x = patientdemographicscalc.reeenergyneeds(
        weight, cm, ageinyears, gender, equation, accuracy);
      if (x !== this.MacrosInfo.controls['energyrequirementgoal'].value) {
          this.MacrosInfo.controls['energyrequirementgoal'].patchValue(x);
      }
    }

    // cals per kg goal
    x = patientdemographicscalc.calgoalperkg(
      this.MacrosInfo.controls['energyrequirementgoal'].value, weight, accuracy);
    if (x !== this.MacrosInfo.controls['energyrequirementperkggoal'].value) {
      this.MacrosInfo.controls['energyrequirementperkggoal'].patchValue(x);
    }

    // starting values for energy requirements
    if (this.MacrosInfo.controls['energyrequirement'].pristine) {
      x = patientdemographicscalc.reeenergyneeds(
                weight, cm, ageinyears, gender, equation, accuracy);
      if (x !== this.MacrosInfo.controls['energyrequirement'].value) {
        this.MacrosInfo.controls['energyrequirement'].patchValue(x);
      }
    }

    if (this.MacrosInfo.controls['energyrequirementperkg'].pristine) {
      x = patientdemographicscalc.calgoalperkg(
      this.MacrosInfo.controls['energyrequirement'].value, weight, accuracy);
      if (x !== this.MacrosInfo.controls['energyrequirementperkg'].value) {
        this.MacrosInfo.controls['energyrequirementperkg'].patchValue(x);
      }
    }

  }

  updatelipidgoal(pinfo, finfo, minfo, tinfo): void {
      const weight = finfo.dosingWeightkg;

      let y = MacroNutrient.getlipidgoalgm(weight,
                        pinfo.daysofLife,
                        minfo.energyrequirementgoal,
                        tinfo.tpndayNumber );

      y = MathConversions.roundtoaccuracy(y);

      if (y !== this.MacrosInfo.controls['lipidsgoal'].value) {
        this.MacrosInfo.controls['lipidsgoal'].patchValue(y);
        if (this.MacrosInfo.controls['lipidsperkg'].pristine) {
          const ykg = MathConversions.roundtoaccuracy(y / this.FluidsInfo.dosingWeightkg);
          this.MacrosInfo.controls['lipidsperkg'].patchValue(ykg);
        }
        if (this.MacrosInfo.controls['lipids'].pristine) {
          this.MacrosInfo.controls['lipids'].patchValue(y);
        }
      }

   }

    updatecarbgoal(minfo, finfo): void {
      const totalcals = minfo.energyrequirementgoal;
      const protein = minfo.proteingoal;
      const proteincal = Unitstable.MacroCals.find(x => x.longname === 'protein');
      const lipids = minfo.lipidsgoal;
      const lipidscal = Unitstable.MacroCals.find(x => x.longname === 'lipid');
      const carbcal = Unitstable.MacroCals.find(x => x.longname === 'carb');
      const weight = finfo.dosingWeightkg;

      let y = MacroNutrient.getxgms(totalcals,
                  protein, proteincal.value,
                  lipids, lipidscal.value,
                  carbcal.value);
      y = MathConversions.roundtoaccuracy(y);

      if (y !== this.MacrosInfo.controls['carbsgoal'].value) {
        this.MacrosInfo.controls['carbsgoal'].patchValue(y);
      }

      if (y !== this.MacrosInfo.controls['carbs'].value) {
        if (this.MacrosInfo.controls['carbs'].pristine) {
          this.MacrosInfo.controls['carbs'].patchValue(y);

          this.MacrosInfo.controls['GIR'].patchValue(
                MacroNutrient.dextrosegmtoGIR(this.MacrosInfo.controls['carbs'].value,
                                            this.FluidsInfo.dosingWeightkg)
          );

          this.MacrosInfo.controls['dextrose'].patchValue(
            MacroNutrient.GIRtoDextros(this.FluidsInfo.fluidVolume,
              this.MacrosInfo.controls['GIR'].value,
              this.FluidsInfo.dosingWeightkg)
          );
        }
      }
  }

  updateproteingoal(pinfo, finfo): void {
    const weight = finfo.dosingWeightkg;
    const ageinyears = pinfo.yearsofLife;
    const daysofLife = pinfo.daysofLife;
    const accuracy = 2;
    let x = 0;

      x = MacroNutrient.getproteingoal(
        weight, daysofLife, ageinyears);
      x = MathConversions.roundtoaccuracy(x);
      
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

  // Carbs
  updatereetotal(protein, lipids, carb): void {
    // const protein = minfo.protein;
    const proteincal = Unitstable.MacroCals.find(x => x.longname === 'protein');
    // const lipids = minfo.lipids;
    const lipidscal = Unitstable.MacroCals.find(x => x.longname === 'lipid');
    // const carb = minfo.carbs;
    const carbcal = Unitstable.MacroCals.find(x => x.longname === 'carb');

    //console.log(minfo.carbs);
    // update calories
    let y = MacroNutrient.getree(
                protein, proteincal.value,
                lipids, lipidscal.value,
                carb, carbcal.value);
    y = MathConversions.roundtoaccuracy(y);

    if (y !== this.MacrosInfo.controls['energyrequirement'].value) {
      this.MacrosInfo.controls['energyrequirement'].patchValue(y);
      this.MacrosInfo.controls['energyrequirement'].markAsDirty();
      this.MacrosInfo.controls['energyrequirement'].markAsTouched();
    }

  }

    // protein
  updateproteinbytotal(minfo, finfo): void {
    const protein = minfo.protein;
    const proteincal = Unitstable.MacroCals.find(x => x.longname === 'protein');
    const lipids = minfo.lipidsgoal;
    const lipidscal = Unitstable.MacroCals.find(x => x.longname === 'lipid');
    const carb = minfo.carbs;
    const carbcal = Unitstable.MacroCals.find(x => x.longname === 'carb');
    const weight = finfo.dosingWeightkg;

    // update calories
    let y = MacroNutrient.getree(
                protein, proteincal.value,
                lipids, lipidscal.value,
                carb, carbcal.value);
    y = MathConversions.roundtoaccuracy(y);

    if (y !== this.MacrosInfo.controls['energyrequirement'].value) {
      this.MacrosInfo.controls['energyrequirement'].patchValue(y);
    }

    // update protein per kg
    y = MathConversions.roundtoaccuracy( protein / weight);
    if (y !== this.MacrosInfo.controls['proteinperkg'].value) {
      this.MacrosInfo.controls['proteinperkg'].patchValue(y);
    }
  }

  updateproteinbykg(protein, lipids, carb, finfo): void {
    const weight = finfo.dosingWeightkg;
    const proteins = MathConversions.roundtoaccuracy( protein * weight );
    const proteincal = Unitstable.MacroCals.find(x => x.longname === 'protein');
    // const lipids = lipids;
    const lipidscal = Unitstable.MacroCals.find(x => x.longname === 'lipid');
    // const carb = minfo.carbs;
    const carbcal = Unitstable.MacroCals.find(x => x.longname === 'carb');

    // update calories
    let y = MacroNutrient.getree(
                proteins, proteincal.value,
                lipids, lipidscal.value,
                carb, carbcal.value);
    y = MathConversions.roundtoaccuracy(y);
    console.log(proteins);
    if (y !== this.MacrosInfo.controls['energyrequirement'].value) {
      this.MacrosInfo.controls['energyrequirement'].patchValue(y);
      this.MacrosInfo.controls['energyrequirement'].markAsDirty();
      this.MacrosInfo.controls['energyrequirement'].markAsTouched();
    }

    // update protein per kg
    if (proteins !== this.MacrosInfo.controls['protein'].value) {
      this.MacrosInfo.controls['protein'].patchValue(proteins);
    }
  }

  // lipids
  updatelipidbykg(protein, lipid, carb, finfo): void {
    const weight = finfo.dosingWeightkg;
    const proteins = protein;
    const proteincal = Unitstable.MacroCals.find(x => x.longname === 'protein');
    const lipids = MathConversions.roundtoaccuracy( lipid * weight );
    const lipidscal = Unitstable.MacroCals.find(x => x.longname === 'lipid');
    // const carb = minfo.carbs;
    const carbcal = Unitstable.MacroCals.find(x => x.longname === 'carb');

    // update calories
    let y = MacroNutrient.getree(
                proteins, proteincal.value,
                lipids, lipidscal.value,
                carb, carbcal.value);
    y = MathConversions.roundtoaccuracy(y);

    if (y !== this.MacrosInfo.controls['energyrequirement'].value) {
      this.MacrosInfo.controls['energyrequirement'].patchValue(y);
      this.MacrosInfo.controls['energyrequirement'].markAsDirty();
      this.MacrosInfo.controls['energyrequirement'].markAsTouched();
    }

    // update protein per kg
    if (lipids !== this.MacrosInfo.controls['lipids'].value) {
      this.MacrosInfo.controls['lipids'].patchValue(lipids);
    }
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
