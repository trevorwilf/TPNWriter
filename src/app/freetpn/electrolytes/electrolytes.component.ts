
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
  selector: 'app-electrolyte',
  templateUrl: './electrolytes.component.html',
  styleUrls: ['./electrolytes.component.css']
})

export class ElectrolyteinfoComponent implements OnInit {

  PatientInfo: IPatient;
  TodaysInfo: IPatientObservations;
  FluidsInfo: IFluids;
  userPrefs: IWriterPrefs;
  // electrolyteInfo: IElectrolyte;
  additiveInfo: IAdditive;
  macroInfo: IMacros;

  weightunits: any;
  volumeunits: any;
  calorieunits: any;
  electorlyteunits: any;
  electorlytlabseunits: any;
  genderlist: any;

  ElectrolyteInfo: FormGroup;

  constructor(
    private formData: FreeTPNDataService,
    private stressorservice: StressorsService,
    private _formBuilder: FormBuilder,
    private _err: ErrorService
  ) {


    this.weightunits = Unitstable.weightunits;
    this.volumeunits = Unitstable.volumeunits;
    this.calorieunits = Unitstable.calorieunits;
    this.electorlyteunits = Unitstable.electorlyteunits;
    this.electorlytlabseunits = Unitstable.electorlytlabseunits;
    this.genderlist = Unitstable.Gender;
  }

  ngOnInit() {

    this.ElectrolyteInfo = this._formBuilder.group({
      sodium: ['0'],
      totalsodium: [],
      sodiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      potassium: ['0'],
      totalpotassium: [],
      potassiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      calcium: ['0'],
      totalcalcium: [],
      calciumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      phosphorus: ['0'],
      totalphosphorus: [],
      phosphorusunit: [this.electorlyteunits.find(x => x.id === 2).longname, Validators.required],
      acetate: ['0'],
      totalacetate: [],
      maxacetate: [],
      acetateunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      magnesium: ['0'],
      totalmagnesium: [],
      magnesiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],

      required: [false]
    });

    // changes due to external forms
    this.formData.CurrentUserPrefInfo.pipe(debounceTime(100)).subscribe(data => {
      this.userPrefs = data;
      if (data) {
          for (let element in data) {
            if (this.ElectrolyteInfo.controls[element]) {
              if (this.ElectrolyteInfo.controls[element].pristine) {
                // console.log(element, this.userPrefs[element]);
                if (this.userPrefs[element].length > 0) {
                  this.ElectrolyteInfo.controls[element].patchValue(this.userPrefs[element]);
                  this.ElectrolyteInfo.controls[element].markAsPristine();
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
      if (this.FluidsInfo.dosingWeightkg) {
        if (this.ElectrolyteInfo.controls['sodium'].value) {

          let x = MathConversions.roundtoaccuracy(this.ElectrolyteInfo.controls['sodium'].value * this.FluidsInfo.dosingWeightkg);
          if (x !== this.ElectrolyteInfo.controls['totalsodium'].value) {
            this.ElectrolyteInfo.controls['totalsodium'].patchValue(x);
          }

          x = MathConversions.roundtoaccuracy(this.ElectrolyteInfo.controls['potassium'].value * this.FluidsInfo.dosingWeightkg);
          if (x !== this.ElectrolyteInfo.controls['totalpotassium'].value) {
            this.ElectrolyteInfo.controls['totalpotassium'].patchValue(x);
          }

          x = MathConversions.roundtoaccuracy(this.ElectrolyteInfo.controls['calcium'].value * this.FluidsInfo.dosingWeightkg);
          if (x !== this.ElectrolyteInfo.controls['totalcalcium'].value) {
            this.ElectrolyteInfo.controls['totalcalcium'].patchValue(x);
          }

          x = MathConversions.roundtoaccuracy(this.ElectrolyteInfo.controls['phosphorus'].value * this.FluidsInfo.dosingWeightkg);
          if (x !== this.ElectrolyteInfo.controls['totalphosphorus'].value) {
            this.ElectrolyteInfo.controls['totalphosphorus'].patchValue(x);
          }

          x = MathConversions.roundtoaccuracy(this.ElectrolyteInfo.controls['magnesium'].value * this.FluidsInfo.dosingWeightkg);
          if (x !== this.ElectrolyteInfo.controls['totalmagnesium'].value) {
            this.ElectrolyteInfo.controls['totalmagnesium'].patchValue(x);
          }

          // acetate
          const maxacetate = ((this.ElectrolyteInfo.controls['sodium'].value + this.ElectrolyteInfo.controls['potassium'].value)
                  - (this.ElectrolyteInfo.controls['phosphorus'].value));
          if (maxacetate !== this.ElectrolyteInfo.controls['maxacetate'].value) {
          this.ElectrolyteInfo.controls['maxacetate'].patchValue(x);
          }

        }
      }
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentAdditiveInfo.subscribe(data => {
      this.additiveInfo = data;
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentMacrosInfo.subscribe(data => {
      this.macroInfo = data;
    },
    catchError(this._err.handleError)
    );

    // Dynamic internal changes
    this.ElectrolyteInfo.valueChanges
      .subscribe(data => {

        if (this.ElectrolyteInfo.valid !== this.ElectrolyteInfo.controls['required'].value) {
          this.ElectrolyteInfo.controls['required'].patchValue(this.ElectrolyteInfo.valid);
          data.required = this.ElectrolyteInfo.valid.valueOf();
        }
        this.updateElectrolyteInfo(data);
    },
    catchError(this._err.handleError)
    );

    this.ElectrolyteInfo.controls['required']
    .valueChanges.pipe(
    debounceTime(200))
    .subscribe(data => {
      this.ElectrolyteInfo.controls['required'].patchValue(this.ElectrolyteInfo.valid);
    },
    catchError(this._err.handleError)
    );
    //   this.ElectrolyteInfo.controls['dripVolume'].valueChanges
    //     .debounceTime(200)
    //     .subscribe(data => {});
    //

    //////////////////////////////////////
    // get Macro source changes
    this.ElectrolyteInfo.controls['sodium'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {

        // if source changes, then mosm can change
        if (this.FluidsInfo) {
          if (this.FluidsInfo.dosingWeightkg) {
            const x = MathConversions.roundtoaccuracy(data * this.FluidsInfo.dosingWeightkg);
            if (x !== this.ElectrolyteInfo.controls['totalsodium'].value) {
              this.ElectrolyteInfo.controls['totalsodium'].patchValue(x);
            }

            const maxacetate = ((data + this.ElectrolyteInfo.controls['potassium'].value)
                                - (this.ElectrolyteInfo.controls['phosphorus'].value));
            if (maxacetate !== this.ElectrolyteInfo.controls['maxacetate'].value) {
              this.ElectrolyteInfo.controls['maxacetate'].patchValue(x);
            }

          }
        }
      },
      catchError(this._err.handleError)
      );

    this.ElectrolyteInfo.controls['potassium'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {

        // if source changes, then mosm can change
        if (this.FluidsInfo) {
          if (this.FluidsInfo.dosingWeightkg) {
            const x = MathConversions.roundtoaccuracy(data * this.FluidsInfo.dosingWeightkg);
            if (x !== this.ElectrolyteInfo.controls['totalpotassium'].value) {
              this.ElectrolyteInfo.controls['totalpotassium'].patchValue(x);
            }
          }
        }
      },
      catchError(this._err.handleError)
      );

      this.ElectrolyteInfo.controls['calcium'].valueChanges.pipe(
        debounceTime(0))
        .subscribe(data => {

          // if source changes, then mosm can change
          if (this.FluidsInfo) {
            if (this.FluidsInfo.dosingWeightkg) {
              const x = MathConversions.roundtoaccuracy(data * this.FluidsInfo.dosingWeightkg);
              if (x !== this.ElectrolyteInfo.controls['totalcalcium'].value) {
                this.ElectrolyteInfo.controls['totalcalcium'].patchValue(x);
              }
            }
          }
        },
        catchError(this._err.handleError)
        );

      this.ElectrolyteInfo.controls['phosphorus'].valueChanges.pipe(
        debounceTime(0))
        .subscribe(data => {

          // if source changes, then mosm can change
          if (this.FluidsInfo) {
            if (this.FluidsInfo.dosingWeightkg) {
              const x = MathConversions.roundtoaccuracy(data * this.FluidsInfo.dosingWeightkg);
              if (x !== this.ElectrolyteInfo.controls['totalphosphorus'].value) {
                this.ElectrolyteInfo.controls['totalphosphorus'].patchValue(x);
              }
            }
          }
        },
        catchError(this._err.handleError)
        );

      this.ElectrolyteInfo.controls['acetate'].valueChanges.pipe(
        debounceTime(0))
        .subscribe(data => {

          // if source changes, then mosm can change
          if (this.FluidsInfo) {
            if (this.FluidsInfo.dosingWeightkg) {
              const x = MathConversions.roundtoaccuracy(data * this.FluidsInfo.dosingWeightkg);
              if (x !== this.ElectrolyteInfo.controls['totalacetate'].value) {
                this.ElectrolyteInfo.controls['totalacetate'].patchValue(x);
              }
            }
          }
        },
        catchError(this._err.handleError)
        );

      this.ElectrolyteInfo.controls['magnesium'].valueChanges.pipe(
        debounceTime(0))
        .subscribe(data => {

          // if source changes, then mosm can change
          if (this.FluidsInfo) {
            if (this.FluidsInfo.dosingWeightkg) {
              const x = MathConversions.roundtoaccuracy(data * this.FluidsInfo.dosingWeightkg);
              if (x !== this.ElectrolyteInfo.controls['totalmagnesium'].value) {
                this.ElectrolyteInfo.controls['totalmagnesium'].patchValue(x);
              }
            }
          }
        },
        catchError(this._err.handleError)
        );
  }

  updateElectrolyteInfo(info: IElectrolyte): void {
    // this.formData.changeElectrolyteInfoSource(info.getRawValue());
    this.formData.changeElectrolyteInfoSource(info);
    // console.log('## updateelectrolyte  ##');
    // console.log(info.getRawValue());
    // console.log(info);
    // console.log(this.formData.CurrentElectrolyteInfo);
    // this.formData.CurrentElectrolyteInfo.map(x => console.log(x));
  }


  hasFormErrors() {
    return !this.ElectrolyteInfo.valid;
  }

  // writetoconsolepi(info) {
  //   console.log(info.getRawValue());
  // }
}
