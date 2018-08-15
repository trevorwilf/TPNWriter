import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { IIVRoutes, IVRoutesngtable } from '../../../share/DB_Values/IVRoute';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toArray';
import * as _ from 'lodash';


@Injectable()

export class IIVRoutesAdminService {

  private basePath = '/globalsettings/ivroute';

  ivroutesRef: AngularFireList<IIVRoutes>;
  ivrouteRef:  AngularFireObject<IIVRoutes>;

  ivroutes: Observable<IIVRoutes[]>; //  list of objects
  ivroute:  Observable<IIVRoutes>;   //   single object

  constructor(private db: AngularFireDatabase) {
    this.ivroutesRef = db.list(this.basePath);
  }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getIvroutesList(query?) {
    // const ivroutesRef = afDb.list('/globalsettings/ivroute')
    // return this.ivroutesRef.valueChanges()
    return this.ivroutesRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }


  // Return a single observable item
  getIvroute(key: string): Observable<IIVRoutes> {
    const ivroutePath = `${this.basePath}/${key}`;
    this.ivroute = this.db.object(ivroutePath).valueChanges();
    return this.ivroute;

  }

  // Return a single static item
  getIvroutestatic(key: string): any {
    const ivroutePath = `${this.basePath}/${key}`;
    return this.db.object(ivroutePath);
  }

  // Create a brand new item
  createIvroute(item: IIVRoutes): void {
    delete item.$key;
    this.ivroutesRef.push(item);
  }

    // bulk Create a brand new item
    bulkcreateIvroute(item: IIVRoutes): void {
      // delete item.$key;
      // item.timestamp = +firebase.database.ServerValue.TIMESTAMP;
      // console.log(item);
      this.ivroutesRef.push(item);
    }


  // Update an exisiting item
  updateIvroute(key: string, newvalue: IIVRoutes): void {
    delete newvalue.$key;
    this.ivroutesRef.update(key, newvalue);
  }

  // Deletes a single item
  deleteIvroute(key: string): void {
    this.ivroutesRef.remove(key);
  }

  // Deletes the entire list of Ivroutes
  deleteAll(): void {
    this.ivroutesRef.remove();
  }


  // Default error handling for all actions
  private handleError(error) {
    console.log(error);
  }


}


