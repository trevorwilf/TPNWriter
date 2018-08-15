import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { BabyFormula, BabyFormulatable } from '../../../share/DB_Values/babyformula';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toArray';
import * as _ from 'lodash';


@Injectable()

export class BabyFormulaAdminService {

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
    // const babyformulasRef = afDb.list('/globalsettings/babyformula')
    // return this.babyformulasRef.valueChanges()
    return this.babyformulasRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }


  // Return a single observable item
  getBabyFormula(key: string): Observable<BabyFormula> {
    const babyformulaPath = `${this.basePath}/${key}`;
    this.babyformula = this.db.object(babyformulaPath).valueChanges();
    return this.babyformula;

  }

  // Return a single static item
  getBabyFormulastatic(key: string): any {
    const babyformulaPath = `${this.basePath}/${key}`;
    return this.db.object(babyformulaPath);
  }

  // Create a bramd new item
  createBabyFormula(item: BabyFormula): void {
    delete item.$key;
    this.babyformulasRef.push(item);
  }

  // bulk Create a brand new item
  bulkcreateBabyFormula(item: BabyFormula): void {
    // delete item.$key;
    // item.timestamp = +firebase.database.ServerValue.TIMESTAMP;
    // console.log(item);
    this.babyformulasRef.push(item);
  }

  // Update an exisiting item
  updateBabyFormula(key: string, newvalue: BabyFormula): void {
    delete newvalue.$key;
    this.babyformulasRef.update(key, newvalue);
  }

  // Deletes a single item
  deleteBabyFormula(key: string): void {
    this.babyformulasRef.remove(key);
  }

  // Deletes the entire list of BabyFormulas
  deleteAll(): void {
    this.babyformulasRef.remove();
  }


  // Default error handling for all actions
  private handleError(error) {
    console.log(error);
  }


}


