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
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Electrolytedetail, Electrolytestable } from '../../../share/DB_Values/Electrolytes';
import { ElectrolytesAdminService } from './electrolyteadmin.service';
import 'rxjs/add/operator/toArray';
// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-electrolytetable',
  templateUrl: './electrolytetable.component.html',
  styleUrls: ['./electrolytetable.component.css']
})

export class ElectrolytetableComponent implements OnInit {

  fileReaded: any;
  public electrolyte: any;
  $update: Observable<any>;
  localDataSource: LocalDataSource = new LocalDataSource();
  Electrolytestable = Electrolytestable.electros;

  constructor(private electrolyteservice: ElectrolytesAdminService) {
    this.electrolyte = this.electrolyteservice.getElectrolytesList();

    this.electrolyte.subscribe(electrolytelist => {
      this.localDataSource.load(electrolytelist);
      this.localDataSource.refresh();
    });

    // for writing to console for troubleshooting
    // this.ivroutes.subscribe(x => {
    //  console.log(x);
    // });
  }

  ngOnInit() {
    this.electrolyte.subscribe(x => {});
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
      this.electrolyteservice.deleteElectrolyte(event.data.$key);
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event): void {
    if (window.confirm('Are you sure you want to save?')) {
      event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this.electrolyteservice.updateElectrolyte(event.newData.$key, event.newData);

    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {

    event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

    this.electrolyteservice.createElectrolyte(event.newData);

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
          field: 'Name',
          search: query
        },
        {
          field: 'protein need',
          search: query
        },
        {
          field: 'coloric need',
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
    // read file from input
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
    var gethttpcsv = Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vR_2LZw6y6s499TG5V_00aY9OoqzM6DIGHL4kvGkU7wq84uMt5Tu83n8gbcOjlD43kiSLEsZFL_oNve/pub?output=csv', {
                            download: true,
                            header: true,
                            dynamicTyping: true,
                            complete: (results) => {
                              this.importhttpcsv(results);
                            }
                });
  }

  importhttpcsv(results) {
    this.electrolyteservice.deleteAll();

    results.data.forEach(item => {
      let tarr = item as Electrolytedetail;
      // console.log(tarr);
      this.electrolyteservice.bulkcreateElectrolyte(tarr);
    });

    this.electrolyte.subscribe(electrolytelist => {
      this.localDataSource.load(electrolytelist);
      this.localDataSource.refresh();
    });

  }


}

