import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import {
  ILipids,
  Lipidsngtable
} from '../../../share/DB_Values/Lipids';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toArray';
import * as _ from 'lodash';


@Injectable()

export class ILipidsAdminService {

  private basePath = '/globalsettings/lipids';

  lipidsRef: AngularFireList<ILipids>;
  lipidRef:  AngularFireObject<ILipids>;

  lipids: Observable<ILipids[]>; //  list of objects
  lipid:  Observable<ILipids>;   //   single object

  constructor(private db: AngularFireDatabase) {
    this.lipidsRef = db.list(this.basePath);
  }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getIvroutesList(query?) {
    // const lipidsRef = afDb.list('/globalsettings/lipid')
    // return this.lipidsRef.valueChanges()
    return this.lipidsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }


  // Return a single observable item
  getIvroute(key: string): Observable<ILipids> {
    const lipidPath = `${this.basePath}/${key}`;
    this.lipid = this.db.object(lipidPath).valueChanges();
    return this.lipid;

  }

  // Return a single static item
  getIvroutestatic(key: string): any {
    const lipidPath = `${this.basePath}/${key}`;
    return this.db.object(lipidPath);
  }

  // Create a brand new item
  createIvroute(item: ILipids): void {
    delete item.$key;
    this.lipidsRef.push(item);
  }

    // bulk Create a brand new item
    bulkcreateIvroute(item: ILipids): void {
      // delete item.$key;
      // item.timestamp = +firebase.database.ServerValue.TIMESTAMP;
      // console.log(item);
      this.lipidsRef.push(item);
    }


  // Update an exisiting item
  updateIvroute(key: string, newvalue: ILipids): void {
    delete newvalue.$key;
    this.lipidsRef.update(key, newvalue);
  }

  // Deletes a single item
  deleteIvroute(key: string): void {
    this.lipidsRef.remove(key);
  }

  // Deletes the entire list of Ivroutes
  deleteAll(): void {
    this.lipidsRef.remove();
  }


  // Default error handling for all actions
  private handleError(error) {
    console.log(error);
  }


}


