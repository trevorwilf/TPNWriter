import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AuthService } from '../../share/auth/auth.service';

import { IWriterPrefs } from '../../share/DB_Values/WriterPrefs';


import { BehaviorSubject ,  Subscription ,  Observable ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, tap, map } from 'rxjs/operators';







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
    this.userpref = this.db.object<IWriterPrefs>(userprefPath).valueChanges();
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


