import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../share/auth/auth.service';
import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { BehaviorSubject ,  Subscription ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, tap, map } from 'rxjs/operators';






import { ErrorService } from '../../share/debug/error.service';

import { UserPreferencesService } from './userpreferences.service';
import { FreeTPNDataService } from '../freetpnshare/freetpndata.service';

import { MaterialModule } from '../../share/UIComponents/material.module';
import { WriterInfo } from '../../share/DB_Values/WriterInfo';

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
  selector: 'app-userpreferences',
  templateUrl: './userpreferences.component.html',
  styleUrls: ['./userpreferences.component.css']
})
export class UserPreferenceComponent implements OnInit {

  userprefRef: any;
  PreferenceInfo: FormGroup;
  userpref: IWriterPrefs;

  energyequationlist: any;
  carbsourcelist: any;
  lipidsourcelist: any;
  lipidPercentlist: any;

  weightunits: any;
  lenghthunits: any;
  volumeunits: any;
  calorieunits: any;
  electorlyteunits: any;
  electorlytlabseunits: any;
  genderlist: any;

  constructor(private af: AuthService,
    private db: AngularFireDatabase,
    private _formBuilder: FormBuilder,
    private _user: UserPreferencesService,
    private formData: FreeTPNDataService,
    private _err: ErrorService
    ) {

      this.userprefRef = this._user.getCurrentUser(this.af.authState.uid);

      this.energyequationlist = Macrotable.energyequation;
      this.carbsourcelist = Macrotable.carbsource;
      this.lipidsourcelist = Macrotable.lipidsource;
      this.lipidPercentlist = Macrotable.lipidPercent;

      this.lenghthunits = Unitstable.lenghthunits;
      this.weightunits = Unitstable.weightunits;
      this.volumeunits = Unitstable.volumeunits;
      this.calorieunits = Unitstable.calorieunits;
      this.electorlyteunits = Unitstable.electorlyteunits;
      this.electorlytlabseunits = Unitstable.electorlytlabseunits;
    }

  ngOnInit() {

    this.PreferenceInfo = this._formBuilder.group({
      bodyweightunits: [this.weightunits.find(x => x.default === '1').longname, Validators.required],
      heightunits: [this.lenghthunits.find(x => x.default === '1').longname, Validators.required],
      // Observation Liquids
      urineunits: [this.volumeunits.find(x => x.default === '1').longname, Validators.required],
      gilossunits: [this.volumeunits.find(x => x.default === '1').longname, Validators.required],
      enteralVolumeunits: [this.volumeunits.find(x => x.default === '1').longname, Validators.required],
      // Observation Labs
      sodiumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      potassiumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      chlorideunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      bicorbonateunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      BUNunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      creatineunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      glucoseunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      calciumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      phosphateunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      magnesiumunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      preabluminunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      albuminunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      triglyceridesunitslab: [this.electorlytlabseunits.find(x => x.default === '1').longname, Validators.required],
      // fluids
      dripVolumeunit: [this.volumeunits.find(x => x.default === '1').longname, Validators.required],
      fluidVolumeunit: [this.volumeunits.find(x => x.default === '1').longname, Validators.required],

      // calculations
      calEquation: [this.energyequationlist.find(x => x.default === '1').longname, Validators.required],
      useGIR: [this.carbsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidSource: [this.lipidsourcelist.find(x => x.default === '1').longname, Validators.required],
      lipidPercent: [this.lipidPercentlist.find(x => x.default === '1').longname, Validators.required],

      // electrolytes
      sodiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      potassiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      calciumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      phosphorusunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      acetateunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],
      magnesiumunit: [this.electorlyteunits.find(x => x.default === '1').longname, Validators.required],

      timestamp: []
    });

    this.userprefRef.subscribe(data => {
      this.userpref = data;
      this.updateUserPrefInfo(data);
      // console.log(this.userpref);
      // console.log(data);
      if (this.PreferenceInfo.pristine) {
        for (let element in data) {
            // console.log(element, this.userpref[element]);
            if (this.userpref[element].length > 0) {
              this.PreferenceInfo.controls[element].patchValue(this.userpref[element]);
            }
        }

      }
    },
    catchError(this._err.handleError)
    );

    // this.PreferenceInfo.valueChanges
    //   .debounceTime(200)
    //   .subscribe(data => this.updateUserPrefInfo(data));

  }



  saveUser(user): void {
    if (window.confirm('Are you sure you want to save?')) {
      user.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this._user.updateUser(this.af.authState.uid, user.getRawValue());
      this.updateUserPrefInfo(user);
    } else {

    }
  }

  updateUserPrefInfo(info: IWriterPrefs): void {
    // console.log(info)
    this.formData.changeCurrentUserPrefInfo(info);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.value === f2.value;
  }

}
