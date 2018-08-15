import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { BabyFormula, BabyFormulatable } from '../../share/DB_Values/babyformula';

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

export class BabyFormulaService {

  private basePath = '/globalsettings/babyformulas';

    babyformulasRef: AngularFireList<BabyFormula>;
    babyformulaRef:  AngularFireObject<BabyFormula>;

    babyformulas: Observable<BabyFormula[]>; //  list of objects
    babyformula:  Observable<BabyFormula>;   //   single object

  constructor(private db: AngularFireDatabase) {
    this.babyformulasRef = db.list(this.basePath);
  }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getBabyFormulasList(query?) {
    // const stressersRef = afDb.list('/globalsettings/stresser')
    // return this.stressersRef.valueChanges()
    return this.babyformulasRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Default error handling for all actions
  // private handleError(error) {
  //   console.log(error);
  // }


}


