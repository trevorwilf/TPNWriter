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
  selector: 'app-todaysobservations',
  templateUrl: './todaysobservations.component.html',
  styleUrls: ['./todaysobservations.component.css']
})
export class TodaysobservationsComponent implements OnInit {

  PatientInfo: IPatient;
  // TodaysInfo: IPatientObservations;
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

  PatientInfosubscription: any;
  ivrouteslist: any;
  bformulalist: any;
  TodaysInfo: FormGroup;
  daysold: number;

  constructor( private formData: FreeTPNDataService,
    private ivrouteservice: IIVRoutesService,
    private bformulaservice: BabyFormulaService,
    private _formBuilder: FormBuilder,
    private _err: ErrorService) {

    this.ivrouteslist = this.ivrouteservice.getIvroutesList();
    this.bformulalist = this.bformulaservice.getBabyFormulasList();

    this.weightunits = Unitstable.weightunits;
    this.volumeunits = Unitstable.volumeunits;
    this.calorieunits = Unitstable.calorieunits;
    this.electorlyteunits = Unitstable.electorlyteunits;
    this.electorlytlabseunits = Unitstable.electorlytlabseunits;
    this.genderlist = Unitstable.Gender;
   }

  ngOnInit() {
    this.ivrouteslist.subscribe(x => {});
    this.bformulalist.subscribe(x => {});

    this.TodaysInfo = this._formBuilder.group({
      todaydate: [ new Date(), Validators.required],
      tpndayNumber: ['', Validators.required],
      bodyweight: ['', Validators.required],
      bodyweightdiff: [''],
      urine: [''],
      giloss: [''],
      ivRoute: ['', Validators.required],

      useEnteral: [false],
      enteralcalDensity: [''],
      enteralProtein: [''],
      enteralLipid: [''],
      enteralCarb: [''],
      enteralVolume: [''],
      enteralFormula: [''],

      sodium: [''],
      potassium: [''],
      chloride: [''],
      bicorbonate: [''],
      BUN: [''],
      creatine: [''],
      glucose: [''],
      calcium: [''],
      phosphate: [''],
      magnesium: [''],
      preablumin: [''],
      albumin: [''],
      triglycerides: [''],

      // units
      bodyweightunits: [this.weightunits.find(x => x.default === '1').longname],
      urineunits: [this.volumeunits.find(x => x.default === '1').longname],
      gilossunits: [this.volumeunits.find(x => x.default === '1').longname],
      enteralVolumeunits: [this.volumeunits.find(x => x.default === '1').longname],
      sodiumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      potassiumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      chlorideunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      bicorbonateunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      BUNunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      creatineunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      glucoseunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      calciumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      phosphateunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      magnesiumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      preabluminunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      albuminunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],
      triglyceridesunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname],


      required: [false]
    });

    // changes due to external forms
    this.formData.CurrentUserPrefInfo.debounceTime(200).subscribe(data => {
      this.userPrefs = data;
      if (data) {
          for (let element in data) {
            if (this.TodaysInfo.controls[element]) {
              if (this.TodaysInfo.controls[element].pristine) {
                // console.log(element, this.userPrefs[element]);
                if (this.userPrefs[element].length > 0) {
                  this.TodaysInfo.controls[element].patchValue(this.userPrefs[element]);
                  this.TodaysInfo.controls[element].markAsPristine();
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

    this.TodaysInfo.controls['todaydate'].markAsDirty();
    this.TodaysInfo.controls['todaydate'].markAsTouched();

    // Dynamic internal changes
    this.TodaysInfo.valueChanges
      .debounceTime(200)
      .subscribe(data => {
        this.updateTodaysInfo(data);

        if (this.TodaysInfo.valid !== this.TodaysInfo.controls['required'].value) {
          this.TodaysInfo.controls['required'].patchValue(this.TodaysInfo.valid);
        }
      },
      catchError(this._err.handleError)
      );

      this.TodaysInfo.controls['required']
      .valueChanges
      .debounceTime(200)
      .subscribe(data => {
        this.TodaysInfo.controls['required'].patchValue(this.TodaysInfo.valid);
      },
      catchError(this._err.handleError)
      );
  }

  updateTodaysInfo(info: IPatientObservations): void {
    this.formData.changeTodaysInfoSource(info);
    // console.log('## updateTodaysInfo  ##');
    // console.log(info);
    // console.log(this.formData.CurrentTodaysInfo);

    // this.formData.CurrentPatientInfo.map(x => console.log(x));
  }

  getageindays(bdate: Date) {

    return patientdemographicscalc.ageindays(bdate);
  }

  // writetoconsolepi(info) {
  //   console.log('## todaysobservations ##');
  //   console.log(info);
  // }

}
