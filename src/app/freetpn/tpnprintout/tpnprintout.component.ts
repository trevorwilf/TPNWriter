
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
  selector: 'app-tpnprintout',
  templateUrl: './tpnprintout.component.html',
  styleUrls: ['./tpnprintout.component.css']
})

export class TPNPrintoutComponent implements OnInit {

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

  TPNPrintout: FormGroup;

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

    this.TPNPrintout = this._formBuilder.group({
      given: [''],
      family: [''],
      MRN: [''],
      CSN: [''],
      roomnumber: [''],
      birthDate: [''],




      required: [false]
    });

    // changes due to external forms
    this.formData.CurrentPatientInfo.subscribe(data => {
      this.PatientInfo = data;
      if (data) {
        // Add Data
        if (data.given) {
          this.TPNPrintout.controls['given'].patchValue(data.given);
        }
        if (data.family) {
          this.TPNPrintout.controls['family'].patchValue(data.family);
        }
        if (data.MRN) {
          this.TPNPrintout.controls['MRN'].patchValue(data.MRN);
        }
        if (data.CSN) {
          this.TPNPrintout.controls['CSN'].patchValue(data.CSN);
        }
        if (data.roomnumber) {
          this.TPNPrintout.controls['roomnumber'].patchValue(data.roomnumber);
        }
        if (data.birthDate) {
          this.TPNPrintout.controls['birthDate'].patchValue(data.birthDate);
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

    this.formData.CurrentElectrolyteInfo.subscribe(data => {
      this.electrolyteInfo = data;
    },
    catchError(this._err.handleError)
    );

    // Dynamic internal changes
    this.TPNPrintout.valueChanges.pipe(debounceTime(50)).subscribe(data => {
      this.updateTPNPrintout(data);

      if (this.TPNPrintout.valid !== this.TPNPrintout.controls['required'].value) {
        this.TPNPrintout.controls['required'].patchValue(this.TPNPrintout.valid);
      }
    },
    catchError(this._err.handleError)
    );

    this.TPNPrintout.controls['required']
    .valueChanges.pipe(
    debounceTime(200))
    .subscribe(data => {
      this.TPNPrintout.controls['required'].patchValue(this.TPNPrintout.valid);
    },
    catchError(this._err.handleError)
    );
    //   this.TPNPrintout.controls['dripVolume'].valueChanges
    //     .debounceTime(200)
    //     .subscribe(data => {});
    //
  }

  updateTPNPrintout(info: IAdditive): void {
    // this.formData.changeAdditiveInfoSource(info.getRawValue());
    // this.formData.changeAdditiveInfoSource(info);
    // console.log('## updateadditive  ##');
    // console.log(info.getRawValue());
    // console.log(info);
    // console.log(this.formData.CurrentAdditiveInfo);
    // this.formData.CurrentAdditiveInfo.map(x => console.log(x));
  }


  hasFormErrors() {
    return !this.TPNPrintout.valid;
  }

  // writetoconsolepi(info) {
  //   console.log(info.getRawValue());
  // }
}
