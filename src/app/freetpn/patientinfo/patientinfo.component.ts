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
  selector: 'app-patientinfo',
  templateUrl: './patientinfo.component.html',
  styleUrls: ['./patientinfo.component.css']
})
export class PatientinfoComponent implements OnInit {

  // PatientInfo: IPatient;
  TodaysInfo: IPatientObservations;
  FluidsInfo: IFluids;
  userPrefs: IWriterPrefs;
  electrolyteInfo: IElectrolyte;
  additiveInfo: IAdditive;
  macroInfo: IMacros;

  weightunits: any;
  lenghthunits: any;
  volumeunits: any;
  calorieunits: any;
  electorlyteunits: any;
  electorlytlabseunits: any;
  genderlist: any;

  stressorslist: any;
  PatientInfo: FormGroup;
  ageindays: number;
  mergeTime: Date;
  maxDate: Date;

    fractiondayofweek: Array<any> = [
      {'id': 1, 'dayofweek': '1/7'},
      {'id': 2, 'dayofweek': '2/7'},
      {'id': 3, 'dayofweek': '3/7'},
      {'id': 4, 'dayofweek': '4/7'},
      {'id': 5, 'dayofweek': '5/7'},
      {'id': 6, 'dayofweek': '6/7'},
      {'id': 7, 'dayofweek': '7/7'}
    ];


  constructor( private formData: FreeTPNDataService,
    private stressorservice: StressorsService,
    private _formBuilder: FormBuilder,
    private _err: ErrorService) {
      this.stressorslist = this.stressorservice.getStressersList();

      this.lenghthunits = Unitstable.lenghthunits;
      this.weightunits = Unitstable.weightunits;
      this.volumeunits = Unitstable.volumeunits;
      this.calorieunits = Unitstable.calorieunits;
      this.electorlyteunits = Unitstable.electorlyteunits;
      this.electorlytlabseunits = Unitstable.electorlytlabseunits;
      this.genderlist = Unitstable.Gender;

      }

  ngOnInit() {
    this.maxDate = new Date();
    // this.formData.CurrentTodaysInfo.subscribe(data => this.CurrentTodaysInfo = data);
    // this.formData.CurrentFluidsInfo.subscribe(data => this.CurrentFluidsInfo = data);

    this.PatientInfo = this._formBuilder.group({
      given: ['', [Validators.required, Validators.minLength(2)]],
      family: ['', [Validators.required, Validators.minLength(1)]],
      gender: ['', [Validators.required, Validators.minLength(1)]],
      MRN: ['', [Validators.minLength(5)]],
      CSN: ['', Validators.minLength(2)],
      roomnumber: [''],
      birthDate: ['', [Validators.required]],
      birthTime: [new Date()],
      daysofLife: [''],
      weeksofLife: [''],
      monthsofLife: [''],
      yearsofLife: [''],
      gestationalAge: [''],
      gestationalAgeDay: [''],
      birthWeight:  [''],
      bodyweightunits: [this.weightunits.find(x => x.default === '1').longname],
      height: ['', Validators.required],
      heightunits: [this.lenghthunits.find(x => x.default === '1').unit],
      stressers:  [''],
      required: [false]
    });

    // changes due to external forms
    this.formData.CurrentUserPrefInfo.debounceTime(500).subscribe(data => {
      this.userPrefs = data;
      if (data) {
          for (let element in data) {
            if (this.PatientInfo.controls[element]) {
              if (this.PatientInfo.controls[element].pristine) {
                // console.log(element, this.userPrefs[element]);
                if (this.userPrefs[element].length > 0) {
                  this.PatientInfo.controls[element].patchValue(this.userPrefs[element]);
                  this.PatientInfo.controls[element].markAsPristine();
                }
              }
            }
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

    // dynamic updates
    this.PatientInfo.valueChanges
      .debounceTime(50)
      .subscribe(data => {
          this.updatePatientInfo(data);

          if (this.PatientInfo.valid !== this.PatientInfo.controls['required'].value) {
            this.PatientInfo.controls['required'].patchValue(this.PatientInfo.valid);
          }

        },
        catchError(this._err.handleError)
        );


    this.PatientInfo.controls['birthDate']
      .valueChanges
      .debounceTime(50)
      .subscribe(data => {
          this.PatientInfo.controls['daysofLife'].patchValue(patientdemographicscalc.ageindays(data));
          this.PatientInfo.controls['weeksofLife'].patchValue(patientdemographicscalc.ageinweeks(data));
          this.PatientInfo.controls['monthsofLife'].patchValue(patientdemographicscalc.ageinmonths(data));
          this.PatientInfo.controls['yearsofLife'].patchValue(patientdemographicscalc.ageinyears(data));
      },
      catchError(this._err.handleError)
      );

    this.PatientInfo.controls['birthTime']
      .valueChanges
      .debounceTime(50)
      .subscribe(data => {

          this.mergeBirthTimeDate(this.PatientInfo.get('birthDate').value, data);
      },
      catchError(this._err.handleError)
      );

      this.PatientInfo.controls['required']
      .valueChanges
      .debounceTime(200)
      .subscribe(data => {
        this.PatientInfo.controls['required'].patchValue(this.PatientInfo.valid);
      },
      catchError(this._err.handleError)
      );

   }

  updatePatientInfo(info: IPatient): void {

    // this.formData.changePatientInfoSource(info.getRawValue());
    this.formData.changePatientInfoSource(info);
    // console.log('## updatepatientinfo  ##');
    // console.log(info.getRawValue());
    // console.log(info);
    // console.log(this.formData.CurrentPatientInfo);

    // this.formData.CurrentPatientInfo.map(x => console.log(x));
  }

  mergeBirthTimeDate(dob: Date, tob: Date) {
    this.mergeTime = patientdemographicscalc.mergeBirthTimeDate(dob, tob);
    // console.log(this.mergeTime);
    this.PatientInfo.controls['birthDate'].patchValue(this.mergeTime);
    this.PatientInfo.controls['birthTime'].patchValue(this.mergeTime);
  }

  hasFormErrors() {
    return !this.PatientInfo.valid;
  }

  // writetoconsolepi(info) {
  //   console.log(info.getRawValue());
  // }

}
