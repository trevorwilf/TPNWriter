import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as Papa from 'papaparse/papaparse.js';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from '@angular/fire/database';
import * as firebase from 'firebase/app';

import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Subscription ,  Observable } from 'rxjs';

import {
  ILipids,
  Lipidsngtable
} from '../../../share/DB_Values/Lipids';
import { ILipidsAdminService } from './lipidadmin.service';

// Observable class extensions



// Observable operators









@Component({
  selector: "app-lipidtable",
  templateUrl: "./lipidtable.component.html",
  styleUrls: ["./lipidtable.component.css"]
})


export class LipidtableComponent implements OnInit {
  fileReaded: any;
  public lipids: any;
  $update: Observable<any>;
  localDataSource: LocalDataSource = new LocalDataSource();
  Lipidsngtable = Lipidsngtable.lipids;

  constructor(private lipidservice: ILipidsAdminService) {
    this.lipids = this.lipidservice.getIvroutesList();

    this.lipids.subscribe(lipidslist => {
      this.localDataSource.load(lipidslist);
      this.localDataSource.refresh();
    });

    // for writing to console for troubleshooting
    // this.lipids.subscribe(x => {
    //  console.log(x);
    // });
  }

  ngOnInit() {
    this.lipids.subscribe(x => {});
  }

  onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      // event.confirm.resolve();
      this.lipidservice.deleteIvroute(event.data.$key);
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event): void {
    if (window.confirm("Are you sure you want to save?")) {
      event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this.lipidservice.updateIvroute(event.newData.$key, event.newData);
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {
    event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

    this.lipidservice.createIvroute(event.newData);
  }

  onSearch(query: string = "") {
    this.localDataSource.setFilter(
      [
        // fields we want to include in the search
        {
          field: "key",
          search: query
        },
        {
          field: "name",
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

    var gethttpcsv = Papa.parse(this.fileReaded, {
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
    var gethttpcsv = Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTCtYh6xZXQyKX2T5HsAvPL8ACT6eJSiw7K1AsoUd_NAzRX0fy519RMLdPt--Njz_CPgEt_WMqFzmPt/pub?output=csv', {
                            download: true,
                            header: true,
                            dynamicTyping: true,
                            complete: (results) => {
                              this.importhttpcsv(results);
                            }
                });
  }

  importhttpcsv(results) {
    this.lipidservice.deleteAll();

    results.data.forEach(item => {
      let tarr = item as ILipids;
      // console.log(tarr);
      this.lipidservice.bulkcreateIvroute(tarr);
    });

    this.lipids.subscribe(ivrouteslist => {
      this.localDataSource.load(ivrouteslist);
      this.localDataSource.refresh();
      });

  }



}


