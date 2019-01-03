
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
import { isNullOrUndefined } from 'util';

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
      withfeedssodium: [],
      sodiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],

      potassium: ['0'],
      totalpotassium: [],
      withfeedspotassium: [],
      potassiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],

      calcium: ['0'],
      totalcalcium: [],
      withfeedscalcium: [],
      calciumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],

      phosphorus: ['0'],
      totalphosphorus: [],
      withfeedsphosphorus: [],
      phosphorusunit: [this.electorlyteunits.find(x => x.id === 2).longname, Validators.required],

      acetate: ['0'],
      totalacetate: [],
      withfeedsacetate: [],
      maxacetatekg: [],
      maxacetatetotal: [],
      acetateunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],

      magnesium: ['0'],
      totalmagnesium: [],
      withfeedsmagnesium: [],
      magnesiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],

      NaPhosphate: ['0'],
      NaAcetate: ['0'],
      NaChloride: ['0'],

      KPhosphate: ['0'],
      KAcetate: ['0'],
      KChloride: ['0'],

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
      if (this.FluidsInfo) {
        if (this.FluidsInfo.dosingWeightkg) {
          if (this.ElectrolyteInfo.controls['sodium'].value) {

            this.updatetotal(this.ElectrolyteInfo.controls['sodium'].value, 'totalsodium');
            this.updatetotal(this.ElectrolyteInfo.controls['potassium'].value, 'totalpotassium');
            this.updatetotal(this.ElectrolyteInfo.controls['calcium'].value, 'totalcalcium');
            this.updatetotal(this.ElectrolyteInfo.controls['phosphorus'].value, 'totalphosphorus');
            this.updatetotal(this.ElectrolyteInfo.controls['magnesium'].value, 'totalmagnesium');

            // acetate
            this.maxacetate();
            this.getPhosphate();
            this.getAcetate();
            this.getChloride();

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
            // update kg to total
            this.updatetotal(data, 'totalsodium');

            // acetate
            this.maxacetate();
            this.getPhosphate();
            this.getAcetate();
            this.getChloride();

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
            // update kg to total
            this.updatetotal(data, 'totalpotassium');

            // acetate
            this.maxacetate();
            this.getPhosphate();
            this.getAcetate();
            this.getChloride();

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
              // update kg to total
              this.updatetotal(data, 'totalcalcium');
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
              // update kg to total
              this.updatetotal(data, 'totalphosphorus');

              // acetate
              this.maxacetate();
              this.getPhosphate();
              this.getAcetate();
              this.getChloride();

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
              // update kg to total
              this.updatetotal(data, 'totalacetate');
              this.maxacetate();
              this.getPhosphate();
              this.getAcetate();
              this.getChloride();
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
              // update kg to total
              this.updatetotal(data, 'totalmagnesium');
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

  updatetotal(perkg: number, total: string): void {
    const x = MathConversions.roundtoaccuracy(perkg * this.FluidsInfo.dosingWeightkg);
    if (x !== this.ElectrolyteInfo.controls[total].value) {
      this.ElectrolyteInfo.controls[total].patchValue(x);
    }
  }

  maxacetate(): void {
    const macetatetotal = ((this.ElectrolyteInfo.controls['totalsodium'].value + this.ElectrolyteInfo.controls['totalpotassium'].value)
        - (this.ElectrolyteInfo.controls['totalphosphorus'].value));
    const macetatekg = macetatetotal / this.FluidsInfo.dosingWeightkg;

    if (macetatekg !== this.ElectrolyteInfo.controls['maxacetatekg'].value) {
      this.ElectrolyteInfo.controls['maxacetatekg'].patchValue(macetatekg);
      this.ElectrolyteInfo.controls['maxacetatetotal'].patchValue(macetatetotal);
    }

    if (macetatetotal !== this.ElectrolyteInfo.controls['maxacetatetotal'].value) {
      this.ElectrolyteInfo.controls['maxacetatekg'].patchValue(macetatekg);
      this.ElectrolyteInfo.controls['maxacetatetotal'].patchValue(macetatetotal);
    }

    if (macetatekg < this.ElectrolyteInfo.controls['acetate'].value) {
      this.ElectrolyteInfo.controls['acetate'].patchValue(macetatekg);
    }
    if (macetatetotal < this.ElectrolyteInfo.controls['totalacetate'].value) {
      this.ElectrolyteInfo.controls['totalacetate'].patchValue(macetatetotal);
    }
  }

  getPhosphate(): void {
    const sodiumtotal = this.ElectrolyteInfo.controls['totalsodium'].value;
    const totalpotassium = this.ElectrolyteInfo.controls['totalpotassium'].value;
    const phosphatetotal = this.ElectrolyteInfo.controls['totalphosphorus'].value;

    // 1 mmol NaPhos = 1.33 mEq Na+
    // 1/1.33 = .75
    const NaPhosph = MathConversions.roundtoaccuracy(Math.min(sodiumtotal, 1.33 * phosphatetotal));
    if (NaPhosph !== this.ElectrolyteInfo.controls['NaPhosphate'].value) {
      this.ElectrolyteInfo.controls['NaPhosphate'].patchValue(NaPhosph);
    }
    // 1 mmol KPhos = 1.47 mEq K+
    // 1/1.47 = .68
    const KPhosph = MathConversions.roundtoaccuracy((phosphatetotal - (sodiumtotal * 0.75)) / 0.68);
    if (KPhosph !== this.ElectrolyteInfo.controls['KPhosphate'].value) {
      this.ElectrolyteInfo.controls['KPhosphate'].patchValue(NaPhosph);
    }

  }

  getAcetate(): void {
    const sodiumtotal = this.ElectrolyteInfo.controls['totalsodium'].value;
    const NaPhosph = this.ElectrolyteInfo.controls['NaPhosphate'].value;
    const acetatetotal = this.ElectrolyteInfo.controls['totalacetate'].value;

    const NaAcetate = MathConversions.roundtoaccuracy(Math.min(sodiumtotal - NaPhosph, acetatetotal), 2);
    if (NaAcetate !== this.ElectrolyteInfo.controls['NaAcetate'].value) {
      this.ElectrolyteInfo.controls['NaAcetate'].patchValue(NaAcetate);
    }

    const totalpotassium = this.ElectrolyteInfo.controls['totalpotassium'].value;
    const KPhosph = this.ElectrolyteInfo.controls['KPhosphate'].value;

    const KAcetate = MathConversions.roundtoaccuracy(Math.min(acetatetotal - NaAcetate, acetatetotal), 2);
    if (KAcetate !== this.ElectrolyteInfo.controls['KAcetate'].value) {
      this.ElectrolyteInfo.controls['KAcetate'].patchValue(KAcetate);
    }

  }

  getChloride(): void {
    const sodiumtotal = this.ElectrolyteInfo.controls['totalsodium'].value;
    const totalpotassium = this.ElectrolyteInfo.controls['totalpotassium'].value;

    // get NACl
    const NaCL = MathConversions.roundtoaccuracy(sodiumtotal -
                this.ElectrolyteInfo.controls['NaPhosphate'].value -
                this.ElectrolyteInfo.controls['NaAcetate'].value, 2);
    if (NaCL !== this.ElectrolyteInfo.controls['NaChloride'].value) {
      this.ElectrolyteInfo.controls['NaChloride'].patchValue(NaCL);
    }

    // get KCl
    const kCL = MathConversions.roundtoaccuracy(totalpotassium -
                this.ElectrolyteInfo.controls['KPhosphate'].value -
                this.ElectrolyteInfo.controls['KAcetate'].value, 2);
    if (kCL !== this.ElectrolyteInfo.controls['KChloride'].value) {
      this.ElectrolyteInfo.controls['KChloride'].patchValue(kCL);
    }
  }

  hasFormErrors() {
    return !this.ElectrolyteInfo.valid;
  }

  // writetoconsolepi(info) {
  //   console.log(info.getRawValue());
  // }
}
