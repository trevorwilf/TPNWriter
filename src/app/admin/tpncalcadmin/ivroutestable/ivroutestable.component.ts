import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as Papa from 'papaparse/papaparse.js';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Subscription ,  Observable } from 'rxjs';

import {
  IIVRoutes,
  IVRoutesngtable
} from '../../../share/DB_Values/IVRoute';
import { IIVRoutesAdminService } from './ivrouteadmin.service';

// Observable class extensions



// Observable operators









@Component({
  selector: 'app-ivroutestable',
  templateUrl: './ivroutestable.component.html',
  styleUrls: ['./ivroutestable.component.css']
})


export class IVroutestableComponent implements OnInit {
  fileReaded: any;
  public ivroutes: any;
  $update: Observable<any>;
  localDataSource: LocalDataSource = new LocalDataSource();
  IVRoutesngtable = IVRoutesngtable.ivroutes;

  constructor(private ivrouteservice: IIVRoutesAdminService) {
    this.ivroutes = this.ivrouteservice.getIvroutesList();

    this.ivroutes.subscribe(ivrouteslist => {
      this.localDataSource.load(ivrouteslist);
      this.localDataSource.refresh();
    });

    // for writing to console for troubleshooting
    // this.ivroutes.subscribe(x => {
    //  console.log(x);
    // });
  }

  ngOnInit() {
    this.ivroutes.subscribe(x => {});
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
      this.ivrouteservice.deleteIvroute(event.data.$key);
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event): void {
    if (window.confirm('Are you sure you want to save?')) {
      event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this.ivrouteservice.updateIvroute(event.newData.$key, event.newData);
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {
    event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

    this.ivrouteservice.createIvroute(event.newData);
  }

  onSearch(query: string = '') {
    this.localDataSource.setFilter(
      [
        // fields we want to include in the search
        {
          field: 'key',
          search: query
        },
        {
          field: 'name',
          search: query
        },
        {
          field: 'Type',
          search: query
        },
        {
          field: 'duration',
          search: query
        }
      ],
      false
    );
    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }

  csv2Array(fileInput: any) {
    // this takes in a manual file processes it and converts and pushes it firebase
    this.fileReaded = fileInput.target.files[0];

    const gethttpcsv = Papa.parse(this.fileReaded, {
                download: true,
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                  this.importhttpcsv(results);
                }
      });
  }


  httpcsv2Array(event) {
    // read file from input
    const gethttpcsv = Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTkgHPjpoE-nadS3B0cB5PAwahKgewk76opgYXChuJ0TOttjYCXhBC28aFrsKl1sIsez0cllh0buFwY/pub?output=csv', {
                            download: true,
                            header: true,
                            dynamicTyping: true,
                            complete: (results) => {
                              this.importhttpcsv(results);
                            }
                });
  }

  importhttpcsv(results) {
    this.ivrouteservice.deleteAll();

    results.data.forEach(item => {
      const tarr = item as IIVRoutes;
      // console.log(tarr);
      this.ivrouteservice.bulkcreateIvroute(tarr);
    });

    this.ivroutes.subscribe(ivrouteslist => {
      this.localDataSource.load(ivrouteslist);
      this.localDataSource.refresh();
      });

  }



}


