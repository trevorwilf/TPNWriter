import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../share/auth/auth.service';
import { AngularFireObject, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { BehaviorSubject ,  Subscription ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, tap, map } from 'rxjs/operators';






import { ErrorService } from '../../share/debug/error.service';

import { UserInfoService } from './userinfo.service';
import { FreeTPNDataService } from '../freetpnshare/freetpndata.service';

import { MaterialModule } from '../../share/UIComponents/material.module';
import { WriterInfo } from '../../share/DB_Values/WriterInfo';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {

  userRef: any;
  user: WriterInfo;
  DieticianInfo: FormGroup;

  constructor(private af: AuthService,
    private db: AngularFireDatabase,
    private _formBuilder: FormBuilder,
    private _user: UserInfoService,
    private _err: ErrorService
    ) {

      this.userRef = this._user.getCurrentUser(this.af.authState.uid);
      this._err.writetoconsole(this.userRef);
    }

  ngOnInit() {
    this.userRef.subscribe(x => { });

    this.DieticianInfo = this._formBuilder.group({
      dieticianfirstName: ['', Validators.required],
      dieticianlastName: ['', Validators.required],
      dieticianphoneNumber: ['', Validators.required],
      dieticianemailAddress: ['', Validators.required],
    });
  }

  saveUser(user): void {
    if (window.confirm('Are you sure you want to save?')) {
      user.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this._user.updateUser(this.af.authState.uid, user);

    } else {

    }
  }

}
