
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Electrolytedetail, Electrolytestable } from '../../../share/DB_Values/Electrolytes';

import { Observable } from 'rxjs';

import * as _ from 'lodash';


@Injectable()

export class ElectrolytesAdminService {

  private basePath = '/globalsettings/electrolyte';

  electrolytesRef: AngularFireList<Electrolytedetail>;
  electrolyteRef:  AngularFireObject<Electrolytedetail>;

  electrolytes: Observable<Electrolytedetail[]>; //  list of objects
  electrolyte:  Observable<Electrolytedetail>;   //   single object

  constructor(private db: AngularFireDatabase) {
    this.electrolytesRef = db.list(this.basePath);
  }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getElectrolytesList(query?) {
    // const electrolytesRef = afDb.list('/globalsettings/electrolyte')
    // return this.electrolytesRef.valueChanges()
    return this.electrolytesRef.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    }));
  }


  // Return a single observable item
  getElectrolyte(key: string): Observable<Electrolytedetail> {
    const electrolytePath = `${this.basePath}/${key}`;
    this.electrolyte = this.db.object<Electrolytedetail>(electrolytePath).valueChanges();
    return this.electrolyte;

  }

  // Return a single static item
  getElectrolytestatic(key: string): any {
    const electrolytePath = `${this.basePath}/${key}`;
    return this.db.object(electrolytePath);
  }

  // Create a bramd new item
  createElectrolyte(item: Electrolytedetail): void {
    delete item.$key;
    this.electrolytesRef.push(item);
  }

  // bulk Create a brand new item
  bulkcreateElectrolyte(item: Electrolytedetail): void {
    // delete item.$key;
    // item.timestamp = +firebase.database.ServerValue.TIMESTAMP;
    // console.log(item);
    this.electrolytesRef.push(item);
  }

  // Update an exisiting item
  updateElectrolyte(key: string, newvalue: Electrolytedetail): void {
    delete newvalue.$key;
    this.electrolytesRef.update(key, newvalue);
  }

  // Deletes a single item
  deleteElectrolyte(key: string): void {
    this.electrolytesRef.remove(key);
  }

  // Deletes the entire list of Electrolytes
  deleteAll(): void {
    this.electrolytesRef.remove();
  }


  // Default error handling for all actions
  private handleError(error) {
    console.log(error);
  }


}


