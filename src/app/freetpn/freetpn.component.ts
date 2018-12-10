
import {debounceTime,  catchError, tap, map } from 'rxjs/operators';
import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/primeng';

import { BehaviorSubject ,  Subscription ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';






import { ErrorService } from '../share/debug/error.service';

// custom math library
import { patientdemographicscalc } from '../share/mathlib/patient-calc';

// freetpn services
import { IIVRoutesService } from './freetpnshare/ivroute.service';
import { FreeTPNDataService } from './freetpnshare/freetpndata.service';
import { StressorsService } from './freetpnshare/stressor.service';

// Interfaces
import { IPatient } from '../share/DB_Values/patient-interface';
import { IIVRoutes } from '../share/DB_Values/IVRoute';
import { IPatientObservations } from '../share/DB_Values/observations-interface';
import { IElectrolyte, Electrolytedetail } from '../share/DB_Values/Electrolytes';
import { Stressors } from '../share/DB_Values/Stressor';
import { IFluids, Fluidstable } from '../share/DB_Values/fluids';
import { IMacros, Macrotable } from '../share/DB_Values/macros';
import { IAdditive, Additivedetail } from '../share/DB_Values/additives';
import { Unitstable } from '../share/DB_Values/Units';
import { IWriterPrefs } from '../share/DB_Values/WriterPrefs';

import {TodaysobservationsComponent} from './todaysobservations/todaysobservations.component';


@Component({
  selector: 'app-freetpn',
  templateUrl: './freetpn.component.html',
  styleUrls: ['./freetpn.component.css']
})

export class FreetpnComponent implements OnInit {

  isLinear = false;

  PatientInfo: IPatient;
  TodaysInfo: IPatientObservations;
  FluidsInfo: IFluids;
  userPrefs: IWriterPrefs;
  electrolyteInfo: IElectrolyte;
  additiveInfo: IAdditive;
  macroInfo: IMacros;


  constructor(private formData: FreeTPNDataService,
    private _formBuilder: FormBuilder,
    private _err: ErrorService ) {

    }

  ngOnInit() {
    // changes due to external forms

    this.formData.CurrentPatientInfo.pipe(debounceTime(5)).subscribe(data => {
      this.PatientInfo = data;
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentTodaysInfo.pipe(debounceTime(5)).subscribe(data => {
      this.TodaysInfo = data;
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentFluidsInfo.pipe(debounceTime(5)).subscribe(data => {
      this.FluidsInfo = data;
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentMacrosInfo.pipe(debounceTime(5)).subscribe(data => {
      this.macroInfo = data;
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentElectrolyteInfo.pipe(debounceTime(5)).subscribe(data => {
      this.electrolyteInfo = data;
    },
    catchError(this._err.handleError)
    );

    this.formData.CurrentAdditiveInfo.pipe(debounceTime(5)).subscribe(data => {
      this.additiveInfo = data;
    },
    catchError(this._err.handleError)
    );

  }





  // writetoconsolepi(info) {
  //   console.log(info);
  // }




}


