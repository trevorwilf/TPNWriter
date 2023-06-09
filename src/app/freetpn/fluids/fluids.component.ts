
import {debounceTime,  catchError, tap, map } from 'rxjs/operators';
import { Component, OnInit, ElementRef, Output, ChangeDetectionStrategy } from '@angular/core';
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
import { IFluids, Fluidstable, IfluidReq } from '../../share/DB_Values/fluids';
import { IMacros, Macrotable } from '../../share/DB_Values/macros';
import { IAdditive, Additivedetail } from '../../share/DB_Values/additives';
import { Unitstable } from '../../share/DB_Values/Units';
import { IWriterPrefs } from '../../share/DB_Values/WriterPrefs';

@Component({
  selector: 'app-fluids',
  templateUrl: './fluids.component.html',
  styleUrls: ['./fluids.component.css']
})
export class FluidsinfoComponent implements OnInit {

  PatientInfo: IPatient;
  TodaysInfo: IPatientObservations;
  // FluidsInfo: IFluids;
  userPrefs: IWriterPrefs;
  electrolyteInfo: IElectrolyte;
  additiveInfo: IAdditive;
  macroInfo: IMacros;
  reqfield: IfluidReq;

  weightunits: any;
  volumeunits: any;
  calorieunits: any;
  electorlyteunits: any;
  electorlytlabseunits: any;
  genderlist: any;

  FluidsInfo: FormGroup;
  firstweekprotocol: any;



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

    this.firstweekprotocol = Fluidstable.firstweekprotocol;
  }

  ngOnInit() {

    // initialize FluidsInfo
    this.FluidsInfo = this._formBuilder.group({
      dosingWeight:  ['', Validators.required],
      dosingWeightkg:  [''],
      use5Dayprotocol: [false],
      useDrips: [false],
      useEnteral: [''],
      dripVolume: [''],
      initialVolume: ['', Validators.required],
      fluidVolume: ['', Validators.required],
      overxminutes: ['1440', Validators.required],
      fluidRate: [''],

      bodyweightunits: [this.weightunits.find(x => x.default === '1').longname, Validators.required],
      dripVolumeunit: [this.volumeunits.find(x => x.default === '1').longname, Validators.required],
      fluidVolumeunit: [this.volumeunits.find(x => x.default === '1').longname, Validators.required],

      required: [false]

    });

    // initialize reqfield
    this.reqfield = {};

    // changes due to external forms
    this.formData.CurrentUserPrefInfo.pipe(debounceTime(500)).subscribe(data => {
      this.userPrefs = data;
      if (data) {
         // this changes the units of measure for the page
          for (const element in data) {
            if (this.FluidsInfo.controls[element]) {
              if (this.FluidsInfo.controls[element].pristine) {
                // console.log(element, this.userPrefs[element]);
                if (this.userPrefs[element].length > 0) {
                  this.FluidsInfo.controls[element].patchValue(this.userPrefs[element]);
                  this.FluidsInfo.controls[element].markAsPristine();
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
      if (data) {
        // switches age related options
        if (data.birthDate) {
          this.reqfield.DOB = true;
          if (data.daysofLife > 8) {
              this.FluidsInfo.controls['use5Dayprotocol'].patchValue(false);
          }
        } else {
          this.reqfield.DOB = false;
        }
      }
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentTodaysInfo.subscribe(data => {
      this.TodaysInfo = data;
      // console.log('ct trigger');
      if (data) {
        if (data.useEnteral) {
          this.FluidsInfo.controls['useEnteral'].patchValue(data.useEnteral);
        }

        if (data.bodyweight) {
          // console.log('data.bodyweight');
          // update dosing weight to be current weight unless adjusted
          if (this.FluidsInfo.controls['dosingWeight'].pristine) {
            this.FluidsInfo.controls['dosingWeight'].patchValue(this.TodaysInfo.bodyweight.valueOf());
            this.FluidsInfo.controls['bodyweightunits'].patchValue(this.TodaysInfo.bodyweightunits.valueOf());
            this.FluidsInfo.controls['dosingWeight'].markAsPristine();
          }

          if (this.PatientInfo) {
            if (this.PatientInfo.birthDate) {
              this.reqfield.DOB = true;
              // this.getinitialfluidVolume(data, this.PatientInfo, this.TodaysInfo);
            } else {
              this.reqfield.DOB = false;
            }
          }
        }
      }
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentMacrosInfo.subscribe(data => {
      this.macroInfo = data;
      if (this.macroInfo) {
        if (this.macroInfo.totalvolofmacros) {
          if (this.macroInfo.totalvolofmacros > this.FluidsInfo.controls['fluidVolume'].value) {

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

    /////////////////////////////////////////
    // Dynamic internal changes
    this.FluidsInfo.valueChanges
      .subscribe(data => {

        if (this.FluidsInfo.valid !== this.FluidsInfo.controls['required'].value) {
          this.FluidsInfo.controls['required'].patchValue(this.FluidsInfo.valid.valueOf());
          data.required = this.FluidsInfo.valid.valueOf();
        }

        this.updateFluidsInfo(data);
    },
    catchError(this._err.handleError)
    );

    this.FluidsInfo.valueChanges.pipe(
      debounceTime(10))
      .subscribe(data => {

        if (this.PatientInfo && this.TodaysInfo) {
          if (this.PatientInfo.birthDate && this.TodaysInfo.bodyweight) {
            this.getinitialfluidVolume(
              data,
              this.PatientInfo,
              this.TodaysInfo
            );
          }
        }

    },
    catchError(this._err.handleError)
    );

    this.FluidsInfo.controls['fluidVolume'].valueChanges.pipe(
      debounceTime(0))
      .subscribe(data => {
        if (!this.FluidsInfo.controls['fluidVolume'].pristine) {
          const minutes = this.FluidsInfo.controls['overxminutes'].value;
          this.getfluidperhour(data, minutes);
        }
      },
      catchError(this._err.handleError)
      );

      this.FluidsInfo.controls['overxminutes'].valueChanges.pipe(
        debounceTime(0))
        .subscribe(data => {
          const vol = this.FluidsInfo.controls['fluidVolume'].value;
          this.getfluidperhour(vol, data);

        },
        catchError(this._err.handleError)
        );

      //this.FluidsInfo.controls['required']
      //.valueChanges.pipe(
      //debounceTime(200))
      //.subscribe(data => {
      //  this.FluidsInfo.controls['required'].patchValue(this.FluidsInfo.valid);
      //},
      //catchError(this._err.handleError)
      //);
  }

  updateFluidsInfo(info: IFluids): void {
    // this.formData.changeFluidsInfoSource(info.getRawValue());
    this.formData.changeFluidsInfoSource(info);
    // console.log('## updatefluids  ##');
    // console.log(info.getRawValue());
    // console.log(info);
    // console.log(this.formData.CurrentFluidsInfo);
    // this.formData.CurrentFluidsInfo.map(x => console.log(x));
  }

  getinitialfluidVolume(finfo, pinfo, tinfo): void {
     // console.log(tinfo.bodyweight);
     // console.log(pinfo.daysofLife);
     // console.log(tinfo);

    if (finfo.dosingWeight) {

      const kgweight = MathConversions
      .converttokgs(finfo.dosingWeight, this.weightunits.find(x => x.longname === finfo.bodyweightunits).tokg);

      if (kgweight !== this.FluidsInfo.controls['dosingWeightkg'].value) {
        this.FluidsInfo.controls['dosingWeightkg'].patchValue(kgweight);
      }

      if (pinfo.daysofLife) {

        // this.FluidsInfo.controls['dosingWeightkg'].patchValue(kgweight);
        if (finfo.use5Dayprotocol === true) {
          const volperkg = this.firstweekprotocol.find(
            x => x.id === pinfo.daysofLife
          );

          // console.log(volperkg.ml);
          const dailyvol = volperkg.ml * kgweight;
          this.FluidsInfo.controls['initialVolume'].patchValue(dailyvol);
          this.getfinalfluidVolume(dailyvol, finfo, tinfo);
          // console.log(dailyvol);

        } else {
            /////////
            let y = FluidCalc.initialfluidVol(kgweight);
            y = MathConversions.roundtoaccuracy(y);
            if (y !== this.FluidsInfo.controls['initialVolume'].value) {
              this.FluidsInfo.controls['initialVolume'].patchValue(y);
            }

            this.getfinalfluidVolume(FluidCalc.initialfluidVol(kgweight), finfo, tinfo);
        }

      }
    }

  }

  getfinalfluidVolume(initialvol, finfo, tinfo): void {
    if (this.FluidsInfo.controls['fluidVolume'].pristine) {
      if (initialvol > 0) {
        let fvol = initialvol;
        if (finfo.useDrips === true) {
          fvol = fvol - finfo.dripVolume;
        }

        if (tinfo.useEnteral === true) {
          fvol = fvol - tinfo.enteralVolume;
        }

        //
        fvol = MathConversions.roundtoaccuracy(fvol);
        const minutes = finfo.overxminutes;
        if (fvol !== this.FluidsInfo.controls['fluidVolume'].value) {
          // console.log(fvol);
          // console.log(this.FluidsInfo.controls['fluidVolume'].value);

          this.FluidsInfo.controls['fluidVolume'].patchValue(fvol);
          this.getfluidperhour(fvol, minutes);
        }
      }
    }
  }

  getfluidperhour(fvol: number, minutes: number = 1440) {
    const hours = minutes / 60;
    this.FluidsInfo.controls['fluidRate'].patchValue(MathConversions.roundtoaccuracy(fvol / hours));
  }

  hasFormErrors() {
    return !this.FluidsInfo.valid;
  }

  // writetoconsolepi(info) {
  //   console.log(info.getRawValue());
  // }
}
