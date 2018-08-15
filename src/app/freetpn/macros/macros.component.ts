import { Component, OnInit, ElementRef, Output } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/primeng';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { catchError, tap, map } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

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

    this.energyequationlist = Macrotable.energyequation;
    this.carbsourcelist = Macrotable.carbsource;
    this.lipidsourcelist = Macrotable.lipidsource;
    this.lipidPercentlist = Macrotable.lipidPercent;

    this.MacrosInfo = this._formBuilder.group({

      energyrequirementMin: [''],
      energyrequirementMax: [''],
      calsperkgperday: [],
      GIR: ['', Validators.required],
      dextrose: ['', Validators.required],
      protein: ['', Validators.required],
      proteingoalMin: ['', Validators.required],
      proteingoalMax: [''],
      cystein: [''],
      lipids: ['', Validators.required],
      carbs: ['', Validators.required],

      // user prefs
      calEquation: [this.energyequationlist.find(x => x.default === '1').longname, Validators.required],
      useGIR: [this.carbsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidSource: [this.lipidsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidPercent: [this.lipidPercentlist.find(x => x.default === '1').longname, Validators.required],

      required: [false]
    });

    // changes due to external forms
    this.formData.CurrentUserPrefInfo.debounceTime(500).subscribe(data => {
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
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentTodaysInfo.subscribe(data => {
      this.TodaysInfo = data;

    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentFluidsInfo.subscribe(data => {
      this.FluidsInfo = data;
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



    // Dynamic internal changes
    this.MacrosInfo.valueChanges.debounceTime(50).subscribe(data => {
      this.updateMacrosInfo(data);

      if (this.MacrosInfo.valid !== this.MacrosInfo.controls['required'].value) {
        this.MacrosInfo.controls['required'].patchValue(this.MacrosInfo.valid);
      }
    },
    catchError(this._err.handleError)
    );

    // flips GIR and Dextrose Calc
    this.MacrosInfo.controls['useGIR'].valueChanges
     .debounceTime(200)
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

     this.MacrosInfo.controls['GIR'].valueChanges
     .debounceTime(200)
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

     this.MacrosInfo.controls['dextrose'].valueChanges
     .debounceTime(200)
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

     this.MacrosInfo.controls['required']
      .valueChanges
      .debounceTime(200)
      .subscribe(data => {
        this.MacrosInfo.controls['required'].patchValue(this.MacrosInfo.valid);
     },
     catchError(this._err.handleError)
     );

  }

  updateeneargyneeds(pinfo, finfo): void {

    const weight = MathConversions.converttokgs(finfo.dosingWeight, this.weightunits.find(x => x.longname === finfo.bodyweightunits).tokg);
    const cm = pinfo.height;
    const ageinyears = pinfo.yearsofLife;
    const gender = pinfo.gender;
    // const equation = this.energyequationlist.find(x => x.longname === this.userPrefs.calEquation).id;
    const equation = this.energyequationlist.find(x => x.longname === this.MacrosInfo.controls['calEquation'].value).id;

    const accuracy = 2;
    this.MacrosInfo.controls['energyrequirementMin'].patchValue(patientdemographicscalc.reeenergyneeds(
      weight, cm, ageinyears, gender, equation, accuracy));

    this.MacrosInfo.controls['calsperkgperday'].patchValue(patientdemographicscalc.calgoalperkg(
      this.MacrosInfo.controls['energyrequirementMin'].value, weight, accuracy));

      // console.log('####################');
      // console.log(equation);
      // console.log(ageinyears);
      // console.log(this.MacrosInfo.controls['energyrequirementMin'].value)
  }

  updateproteingoal(pinfo, finfo): void {
    const weight = MathConversions.converttokgs(finfo.dosingWeight, this.weightunits.find(x => x.longname === finfo.bodyweightunits).tokg);
    const ageinyears = pinfo.yearsofLife;
    const daysofLife = pinfo.daysofLife;
    const accuracy = 2;

    this.MacrosInfo.controls['proteingoalMin'].patchValue(MacroNutrient.getproteingoal(
      weight, daysofLife, ageinyears));

    if (this.MacrosInfo.controls['protein'].pristine) {
      this.MacrosInfo.controls['protein'].patchValue(MacroNutrient.getproteingoal(
        weight, daysofLife, ageinyears));
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
