import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Stressors, Stressorstable } from '../../../share/DB_Values/Stressor';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toArray';
import * as _ from 'lodash';


@Injectable()

export class StressorsAdminService {

  private basePath = '/globalsettings/stresser';

  stressersRef: AngularFireList<Stressors>;
  stresserRef:  AngularFireObject<Stressors>;

  stressers: Observable<Stressors[]>; //  list of objects
  stresser:  Observable<Stressors>;   //   single object

  constructor(private db: AngularFireDatabase) {
    this.stressersRef = db.list(this.basePath);
  }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getStressersList(query?) {
    // const stressersRef = afDb.list('/globalsettings/stresser')
    // return this.stressersRef.valueChanges()
    return this.stressersRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }


  // Return a single observable item
  getStresser(key: string): Observable<Stressors> {
    const stresserPath = `${this.basePath}/${key}`;
    this.stresser = this.db.object(stresserPath).valueChanges();
    return this.stresser;

  }

  // Return a single static item
  getStresserstatic(key: string): any {
    const stresserPath = `${this.basePath}/${key}`;
    return this.db.object(stresserPath);
  }

  // Create a bramd new item
  createStresser(item: Stressors): void {
    delete item.$key;
    this.stressersRef.push(item);
  }

  // bulk Create a brand new item
  bulkcreateStresser(item: Stressors): void {
    // delete item.$key;
    // item.timestamp = +firebase.database.ServerValue.TIMESTAMP;
    // console.log(item);
    this.stressersRef.push(item);
  }

  // Update an exisiting item
  updateStresser(key: string, newvalue: Stressors): void {
    delete newvalue.$key;
    this.stressersRef.update(key, newvalue);
  }

  // Deletes a single item
  deleteStresser(key: string): void {
    this.stressersRef.remove(key);
  }

  // Deletes the entire list of Stressers
  deleteAll(): void {
    this.stressersRef.remove();
  }


  // Default error handling for all actions
  private handleError(error) {
    console.log(error);
  }


}


