
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
  aassourcelist: any;
  dextrosesourcelist: any;

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
    this.aassourcelist = Macrotable.aassource;
    this.dextrosesourcelist = Macrotable.dextrosesource;

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
      glutamate: [''],

      lipidsgoalMin: ['', Validators.required],
      lipidsgoalMax: ['', Validators.required],
      lipidsgoal: ['', Validators.required],
      lipids: ['', Validators.required],
      lipidsperkg: ['', Validators.required],

      carbs: ['', Validators.required],
      carbsgoal: ['', Validators.required],

      aassolvol: ['0'],
      lipidsolvol: ['0'],
      carbsolvol: ['0'],
      aasmOsm: ['0'],
      lipidmOsm: ['0'],
      carbmOsm: ['0'],
      aasfinalconcentration: [''],
      lipidfinalconcentration: [''],
      carbfinalconcentration: [''],
      mOsm_L: [''],
      totalvolofmacros: [''],

      // user prefs
      calEquation: [this.energyequationlist.find(x => x.default === '1').longname, Validators.required],
      useGIR: [this.carbsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidSource: [this.lipidsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidPercent: [this.lipidsourcelist.find(x => x.default === '1').percent, Validators.required],
      lipidmOsm_L: [this.lipidsourcelist.find(x => x.default === '1').mOsm_L, Validators.required],
      aasSource: [this.aassourcelist.find(x => x.default === '1').longname, Validators.required],
      aasPercent: [this.aassourcelist.find(x => x.default === '1').percent, Validators.required],
      aasmOsm_L: [this.aassourcelist.find(x => x.default === '1').mOsm_L, Validators.required],
      dextroseSource: [this.dextrosesourcelist.find(x => x.default === '1').longname, Validators.required],
      dextrosePercent: [this.dextrosesourcelist.find(x => x.default === '1').percent, Validators.required],
      dextrosemOsm_L: [this.dextrosesourcelist.find(x => x.default === '1').mOsm_L, Validators.required],

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
      if (data) {
        if (this.PatientInfo) {
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

        if (this.MacrosInfo && this.FluidsInfo.fluidVolume) {
          // if fluid vol change we need to recalc mosm
          if (this.electrolyteInfo) {
            this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
          } else {
            this.updatemosm(this.MacrosInfo, 0, this.FluidsInfo);
          }

          // if volume or minutes change we want to recalc GIR
          this.updatecarbgoal(this.MacrosInfo, this.FluidsInfo);

        }
      }
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentElectrolyteInfo.subscribe(data => {
      this.electrolyteInfo = data;
      if (this.MacrosInfo && this.FluidsInfo) {
        this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
      }
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
        this.macroInfo = data;
    },
    catchError(this._err.handleError)
    );

    // get Macro source changes
    this.MacrosInfo.controls['dextroseSource'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {
        this.MacrosInfo.controls['dextrosePercent'].patchValue(this.dextrosesourcelist.find(x => x.name === data).percent);
        this.MacrosInfo.controls['dextrosemOsm_L'].patchValue(this.dextrosesourcelist.find(x => x.name === data).mOsm_L);

        // if source changes, then mosm can change
        if (this.FluidsInfo) {
          if (this.FluidsInfo.fluidVolume) {
            if (this.electrolyteInfo) {
              this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
            } else {
              this.updatemosm(this.MacrosInfo, 0, this.FluidsInfo);
            }
          }
        }
      },
      catchError(this._err.handleError)
      );

    this.MacrosInfo.controls['aasSource'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {
        this.MacrosInfo.controls['aasPercent'].patchValue(this.aassourcelist.find(x => x.name === data).percent);
        this.MacrosInfo.controls['aasmOsm_L'].patchValue(this.aassourcelist.find(x => x.name === data).mOsm_L);

        // if source changes, then mosm can change
        if (this.FluidsInfo) {
          if (this.FluidsInfo.fluidVolume) {
            if (this.electrolyteInfo) {
              this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
            } else {
              this.updatemosm(this.MacrosInfo, 0, this.FluidsInfo);
            }
          }
        }
      },
      catchError(this._err.handleError)
      );

    this.MacrosInfo.controls['lipidSource'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {
        this.MacrosInfo.controls['lipidPercent'].patchValue(this.lipidsourcelist.find(x => x.name === data).percent);
        this.MacrosInfo.controls['lipidmOsm_L'].patchValue(this.lipidsourcelist.find(x => x.name === data).mOsm_L);

        // if source changes, then mosm can change
        if (this.FluidsInfo) {
          if (this.FluidsInfo.fluidVolume) {
            if (this.electrolyteInfo) {
              this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
            } else {
              this.updatemosm(this.MacrosInfo, 0, this.FluidsInfo);
            }
          }
        }
      },
      catchError(this._err.handleError)
      );

    // get lipid goal
    this.MacrosInfo.valueChanges.pipe(
      debounceTime(10))
      .subscribe(data => {

      if (this.MacrosInfo.controls['lipids'].pristine) {
        if (data && this.FluidsInfo && this.TodaysInfo && this.PatientInfo) {
          // console.log('lipid goal');
          // console.log(data.energyrequirementgoal);
          if ((this.PatientInfo.daysofLife)
                && (this.FluidsInfo.dosingWeightkg)
                && (data.energyrequirementgoal)
                && (this.TodaysInfo.tpndayNumber) ) {
                  this.updatelipidgoal(this.PatientInfo,
                    this.FluidsInfo,
                    data,
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
                      this.FluidsInfo.dosingWeightkg,
                      this.FluidsInfo.overxminutes)
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
                                              this.FluidsInfo.dosingWeightkg,
                                              this.FluidsInfo.overxminutes)
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
                          this.FluidsInfo.dosingWeightkg,
                          this.FluidsInfo.overxminutes)
                        );

                  this.MacrosInfo.controls['carbs'].patchValue(
                    MacroNutrient.GIRtodextrosegm(this.MacrosInfo.controls['GIR'].value,
                      this.FluidsInfo.dosingWeightkg,
                      this.FluidsInfo.overxminutes));

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
                                                    this.FluidsInfo.dosingWeightkg,
                                                    this.FluidsInfo.overxminutes)
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

          // update protein and ree
          if (this.MacrosInfo.controls['lipids'].value &&
              this.MacrosInfo.controls['protein'].value) {
            this.updatereetotal(this.MacrosInfo.controls['protein'].value,
                              this.MacrosInfo.controls['lipids'].value,
                              this.MacrosInfo.controls['carbs'].value,
                              this.FluidsInfo.dosingWeightkg);
          }
        }

        if (this.FluidsInfo) {
          if (this.FluidsInfo.fluidVolume) {
            const dextrosesolconc = this.MacrosInfo.controls['dextrosePercent'].value;
            const dextrosemosm = this.MacrosInfo.controls['dextrosemOsm_L'].value;
            const fluidvol = this.FluidsInfo.fluidVolume.valueOf();

            let x = MacroNutrient.volneededml(data, dextrosesolconc);
            if (x !== this.MacrosInfo.controls['carbsolvol'].value) {
              this.MacrosInfo.controls['carbsolvol'].patchValue(x);
            }

            const y = MacroNutrient.mosmcalc(x, dextrosemosm);
            if (y !== this.MacrosInfo.controls['carbmOsm'].value) {
              this.MacrosInfo.controls['carbmOsm'].patchValue(y);
            }

            x = MacroNutrient.finalconcentration(data, dextrosesolconc, fluidvol);
            if (x !== this.MacrosInfo.controls['carbfinalconcentration'].value) {
              this.MacrosInfo.controls['carbfinalconcentration'].patchValue(x);
            }

          }
        }

        if (this.FluidsInfo) {
          if (this.FluidsInfo.fluidVolume) {
            if (this.electrolyteInfo) {
              this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
            } else {
              this.updatemosm(this.MacrosInfo, 0, this.FluidsInfo);
            }
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
          if (this.FluidsInfo) {
            if (this.FluidsInfo.fluidVolume) {
              const proteinsolconc = this.MacrosInfo.controls['aasPercent'].value;
              const proteinmosm = this.MacrosInfo.controls['aasmOsm_L'].value;
              const fluidvol = this.FluidsInfo.fluidVolume.valueOf();

              let x = MacroNutrient.volneededml(data, proteinsolconc);
              if (x !== this.MacrosInfo.controls['aassolvol'].value) {
                this.MacrosInfo.controls['aassolvol'].patchValue(x);
              }

              const y = MacroNutrient.mosmcalc(x, proteinmosm);
              if (y !== this.MacrosInfo.controls['aasmOsm'].value) {
                this.MacrosInfo.controls['aasmOsm'].patchValue(y);
              }

              if (this.FluidsInfo) {
                if (this.FluidsInfo.fluidVolume) {
                  if (this.electrolyteInfo) {
                    this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
                  } else {
                    this.updatemosm(this.MacrosInfo, 0, this.FluidsInfo);
                  }
                }
              }

              x = MacroNutrient.finalconcentration(data, proteinsolconc, fluidvol);
              if (x !== this.MacrosInfo.controls['aasfinalconcentration'].value) {
                this.MacrosInfo.controls['aasfinalconcentration'].patchValue(x);
              }

            }
          }
      },
      catchError(this._err.handleError)
      );

    // dynamic lipids
    this.MacrosInfo.controls['lipidsperkg'].valueChanges.pipe(
      debounceTime(0))
        .subscribe(data => {
          if (!this.MacrosInfo.controls['lipidsperkg'].pristine) {

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

        if (this.FluidsInfo) {
          if (this.FluidsInfo.fluidVolume) {
            const lipidsolconc = this.MacrosInfo.controls['lipidPercent'].value;
            const lipidmosm = this.MacrosInfo.controls['lipidmOsm_L'].value;
            const fluidvol = this.FluidsInfo.fluidVolume.valueOf();

            let x = MacroNutrient.volneededml(data, lipidsolconc);
            if (x !== this.MacrosInfo.controls['lipidsolvol'].value) {
              this.MacrosInfo.controls['lipidsolvol'].patchValue(x);
            }

            const y = MacroNutrient.mosmcalc(x, lipidmosm);
            if (y !== this.MacrosInfo.controls['lipidmOsm'].value) {
              this.MacrosInfo.controls['lipidmOsm'].patchValue(y);
            }

            if (this.FluidsInfo) {
              if (this.FluidsInfo.fluidVolume) {
                if (this.electrolyteInfo) {
                  this.updatemosm(this.MacrosInfo, this.electrolyteInfo, this.FluidsInfo);
                } else {
                  this.updatemosm(this.MacrosInfo, 0, this.FluidsInfo);
                }
              }
            }

            x = MacroNutrient.finalconcentration(data, lipidsolconc, fluidvol);
            if (x !== this.MacrosInfo.controls['lipidfinalconcentration'].value) {
              this.MacrosInfo.controls['lipidfinalconcentration'].patchValue(x);
            }

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
    // console.log(x);
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

      // console.log('lipid goal');
      // console.log(weight);
      // console.log(pinfo.daysofLife);
      // console.log(minfo.energyrequirementgoal);
      let y = MacroNutrient.getlipidgoalgm(weight,
                        pinfo.daysofLife,
                        minfo.energyrequirementgoal,
                        tinfo.tpndayNumber );
      // console.log(y);
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
                                            this.FluidsInfo.dosingWeightkg,
                                            this.FluidsInfo.overxminutes)
          );

          this.MacrosInfo.controls['dextrose'].patchValue(
            MacroNutrient.GIRtoDextros(this.FluidsInfo.fluidVolume,
              this.MacrosInfo.controls['GIR'].value,
              this.FluidsInfo.dosingWeightkg,
              this.FluidsInfo.overxminutes)
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
  updatereetotal(protein, lipids, carb, weight): void {
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

    console.log(weight);
    let x = patientdemographicscalc.calgoalperkg(y, weight);
    if (x !== this.MacrosInfo.controls['energyrequirementperkg'].value) {
      this.MacrosInfo.controls['energyrequirementperkg'].patchValue(x);
      this.MacrosInfo.controls['energyrequirementperkg'].markAsDirty();
      this.MacrosInfo.controls['energyrequirementperkg'].markAsTouched();
    }


  }

    // protein
  updateproteinbytotal(minfo, finfo): void {
    const protein = minfo.protein;
    //const proteincal = Unitstable.MacroCals.find(x => x.longname === 'protein');
    const lipids = minfo.lipidsgoal;
    //const lipidscal = Unitstable.MacroCals.find(x => x.longname === 'lipid');
    const carb = minfo.carbs;
    //const carbcal = Unitstable.MacroCals.find(x => x.longname === 'carb');
    const weight = finfo.dosingWeightkg;

    this.updatereetotal(protein, lipids, carb, weight);

    // update protein per kg
    let y = MathConversions.roundtoaccuracy( protein / weight);
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
    this.updatereetotal(proteins, lipids, carb, weight);

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
    this.updatereetotal(proteins, lipids, carb, weight);

    // update protein per kg
    if (lipids !== this.MacrosInfo.controls['lipids'].value) {
      this.MacrosInfo.controls['lipids'].patchValue(lipids);
    }
  }

  // MOSM SECTION
  updatemosm(minfo, einfo, finfo) {
    // console.log('update mosm');
    // console.log(minfo);
    // first get amounts
    const totalvol = finfo.fluidVolume;
    const aasmOsm = minfo.controls['aasmOsm'].value;
    const lipidmOsm = minfo.controls['lipidmOsm'].value;
    const carbmOsm = minfo.controls['carbmOsm'].value;

    // will need to add additional moduales after
    // electrolytes and additives are done

    // mosm is per liter total vol must be converted from ml to l
    let totalmosm = (aasmOsm + lipidmOsm + carbmOsm) / ( totalvol / 1000 );
    totalmosm = MathConversions.roundtoaccuracy(totalmosm);

    if (totalmosm !== this.MacrosInfo.controls['mOsm_L'].value) {
      this.MacrosInfo.controls['mOsm_L'].patchValue(totalmosm);
    }

    this.updatetotalvol(minfo, einfo, finfo)

  }

  updatetotalvol(minfo, einfo, finfo) {
    const totalvol = finfo.fluidVolume;
    const aassolvol = minfo.controls['aassolvol'].value;
    const lipidsolvol = minfo.controls['lipidsolvol'].value;
    const carbsolvol = minfo.controls['carbsolvol'].value;

    // will need to add additional moduales after
    // electrolytes and additives are done

    // mosm is per liter total vol must be converted from ml to l
    let totalvolofmacros = (aassolvol + lipidsolvol + carbsolvol);
    totalvolofmacros = MathConversions.roundtoaccuracy(totalvol);

    if (totalvolofmacros !== this.MacrosInfo.controls['totalvolofmacros'].value) {
      this.MacrosInfo.controls['totalvolofmacros'].patchValue(totalvolofmacros);
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
