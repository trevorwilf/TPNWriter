import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { AuthService } from '../../share/auth/auth.service';

import { WriterInfo } from '../../share/DB_Values/WriterInfo';


import { BehaviorSubject ,  Subscription ,  Observable ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, tap, map } from 'rxjs/operators';







import { ErrorService } from '../../share/debug/error.service';

import * as _ from 'lodash';


@Injectable()

export class UserInfoService {

  private userPath = null;
  private userbasePath =  'users/';

  userRef: AngularFireObject<any>;
  user:  Observable<WriterInfo>;

  constructor(private af: AuthService,
    private db: AngularFireDatabase) {

      // this.userRef = db.list(this.userbasePath);

  }

  getCurrentUser(uid: string) {
    const userPath =  `users/${uid}`;
    this.user = this.db.object<WriterInfo>(userPath).valueChanges();
    return this.user;
  }

  // Update an exisiting item
  updateUser(key: string, newvalue: WriterInfo): void {
    // const userPath =  `users/${key}`;
    const userPath =  'users';
    this.db.list(userPath).set(key, newvalue);


    // this.user.update(key, newvalue);

  }

  // Default error handling for all actions
  // private handleError(error) {
  //   console.log(error);
  // }


}


