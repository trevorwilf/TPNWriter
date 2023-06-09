import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase/app';

import { Stressors, Stressorstable } from '../../share/DB_Values/Stressor';

import { BehaviorSubject ,  Subscription ,  Observable ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, tap, map } from 'rxjs/operators';







import { ErrorService } from '../../share/debug/error.service';

import * as _ from 'lodash';


@Injectable()

export class StressorsService {

  private basePath = '/globalsettings/stresser';

  stressersRef: AngularFireList<Stressors>;
  stresserRef:  AngularFireObject<Stressors>;

  stressers: Observable<Stressors[]>; //  list of objects
  stresser:  Observable<Stressors>;   //   single object

  constructor(private db: AngularFireDatabase,
    private _err: ErrorService) {
    this.stressersRef = db.list(this.basePath);
  }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getStressersList(query?) {
    // const stressersRef = afDb.list('/globalsettings/stresser')
    // return this.stressersRef.valueChanges()
    return this.stressersRef.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    },
    catchError(this._err.handleError)
    ));
  }

  // Default error handling for all actions
  // private handleError(error) {
  //   console.log(error);
  // }


}


