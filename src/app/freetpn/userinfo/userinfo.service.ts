import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AuthService } from '../../share/auth/auth.service';

import { WriterInfo } from '../../share/DB_Values/WriterInfo';


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
    this.user = this.db.object(userPath).valueChanges();
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


