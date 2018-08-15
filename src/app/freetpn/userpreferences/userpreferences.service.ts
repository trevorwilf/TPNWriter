import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AuthService } from '../../share/auth/auth.service';

import { IWriterPrefs } from '../../share/DB_Values/WriterPrefs';


import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { catchError, tap, map } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';

import { ErrorService } from '../../share/debug/error.service';

import * as _ from 'lodash';


@Injectable()

export class UserPreferencesService {

  private userPath = null;
  private userbasePath =  'users/';

  userprefRef: AngularFireObject<any>;
  userpref:  Observable<IWriterPrefs>;

  constructor(private af: AuthService,
    private db: AngularFireDatabase,
    private _err: ErrorService
) {

      // this.userprefRef = db.list(this.userbasePath);

  }

  getCurrentUser(uid: string) {
    const userprefPath =  `users/${uid}/preferences/`;
    this.userpref = this.db.object(userprefPath).valueChanges();
    return this.userpref;
  }

  // Update an exisiting item
  updateUser(uid: string, newvalue: IWriterPrefs): void {
    // const userprefPath =  `userprefs/${key}`;
    const userprefPath =  `users/${uid}`;
    this.db.list(userprefPath).set('preferences', newvalue);
  }

  // Default error handling for all actions
  // private handleError(error) {
  //   console.log(error);
  // }


}


