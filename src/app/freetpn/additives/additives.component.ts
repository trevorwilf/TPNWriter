
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
  selector: 'app-additive',
  templateUrl: './additives.component.html',
  styleUrls: ['./additives.component.css']
})

export class AdditiveinfoComponent implements OnInit {
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

  AdditiveInfo: FormGroup;

  constructor(
    private formData: FreeTPNDataService,
    private stressorservice: StressorsService,
    private _formBuilder: FormBuilder,
    private _err: ErrorService
  ) {}

  ngOnInit() {

    this.AdditiveInfo = this._formBuilder.group({
      heparin: [],
      heparinunit: [],
      multiVitamin: [false],
      traceelements: [false],
      zinc: [false],
      ironeDextran: [],
      ironeDextranunit: [],
      carnitine: [],
      carnitineunit: [],
      selenium: [],
      seleniumunit: [],
      famotidine: [],
      famotidineunit: [],
      required: [false]
    });

    // changes due to external forms
    this.formData.CurrentUserPrefInfo.pipe(debounceTime(500)).subscribe(data => {
      this.userPrefs = data;
      if (data) {
          for (let element in data) {
            if (this.AdditiveInfo.controls[element]) {
              if (this.AdditiveInfo.controls[element].pristine) {
                // console.log(element, this.userPrefs[element]);
                if (this.userPrefs[element].length > 0) {
                  this.AdditiveInfo.controls[element].patchValue(this.userPrefs[element]);
                  this.AdditiveInfo.controls[element].markAsPristine();
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

    this.formData.CurrentMacrosInfo.subscribe(data => {
      this.macroInfo = data;
    },
    catchError(this._err.handleError)
    );

    // Dynamic internal changes
    this.AdditiveInfo.valueChanges
      .subscribe(data => {

        if (this.AdditiveInfo.valid !== this.AdditiveInfo.controls['required'].value) {
          this.AdditiveInfo.controls['required'].patchValue(this.AdditiveInfo.valid);
          data.required = this.AdditiveInfo.valid.valueOf();
        }
        this.updateAdditiveInfo(data);
    },
    catchError(this._err.handleError)
    );

    //this.AdditiveInfo.controls['required']
    //.valueChanges.pipe(
    //debounceTime(200))
    //.subscribe(data => {
    //  this.AdditiveInfo.controls['required'].patchValue(this.AdditiveInfo.valid);
    //},
    //catchError(this._err.handleError)
   // );

    //   this.AdditiveInfo.controls['dripVolume'].valueChanges
    //     .debounceTime(200)
    //     .subscribe(data => {});
    //
  }

  updateAdditiveInfo(info: IAdditive): void {
    // this.formData.changeAdditiveInfoSource(info.getRawValue());
    this.formData.changeAdditiveInfoSource(info);
    // console.log('## updateadditive  ##');
    // console.log(info.getRawValue());
    // console.log(info);
    // console.log(this.formData.CurrentAdditiveInfo);
    // this.formData.CurrentAdditiveInfo.map(x => console.log(x));
  }


  hasFormErrors() {
    return !this.AdditiveInfo.valid;
  }

  // writetoconsolepi(info) {
  //   console.log(info.getRawValue());
  // }
}
