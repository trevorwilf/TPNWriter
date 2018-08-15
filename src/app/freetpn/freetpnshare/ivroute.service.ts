import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { IIVRoutes, IVRoutesngtable } from '../../share/DB_Values/IVRoute';

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

export class IIVRoutesService {

  private basePath = '/globalsettings/ivroute';

  ivroutesRef: AngularFireList<IIVRoutes>;
  ivrouteRef:  AngularFireObject<IIVRoutes>;

  ivroutes: Observable<IIVRoutes[]>; //  list of objects
  ivroute:  Observable<IIVRoutes>;   //   single object

  constructor(private db: AngularFireDatabase,
    private _err: ErrorService) {
    this.ivroutesRef = db.list(this.basePath);
  }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getIvroutesList(query?) {
    // const ivroutesRef = afDb.list('/globalsettings/ivroute')
    // return this.ivroutesRef.valueChanges()
    return this.ivroutesRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    },
    catchError(this._err.handleError)
    );
  }


  // Default error handling for all actions
  // private handleError(error) {
  //   console.log(error);
  // }


}


