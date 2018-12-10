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

// import { BabyFormula, BabyFormulatable } from '../../../share/DB_Values/babyformula';
import { BabyFormula, BabyFormulatable } from '../../../share/DB_Values/babyformula';
import { BabyFormulaAdminService } from './babyformulaadmin.service';

// Observable class extensions



// Observable operators









@Component({
  selector: 'app-babyformulatable',
  templateUrl: './babyformulaadmintable.component.html',
  styleUrls: ['./babyformulaadmintable.component.css']
})

export class BabyFormulatableComponent implements OnInit {

  fileReaded: any;
  public babyformula: any;
  $update: Observable<any>;
  localDataSource: LocalDataSource = new LocalDataSource();
  BabyFormulatable = BabyFormulatable.bformula;

  constructor(private babyformulaservice: BabyFormulaAdminService) {
    this.babyformula = this.babyformulaservice.getBabyFormulasList();

    this.babyformula.subscribe(babyformulalist => {
      this.localDataSource.load(babyformulalist);
      this.localDataSource.refresh();
    });

    // for writing to console for troubleshooting
    // this.ivroutes.subscribe(x => {
    //  console.log(x);
    // });
  }

  ngOnInit() {
    this.babyformula.subscribe(x => {});



  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
      this.babyformulaservice.deleteBabyFormula(event.data.$key);
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event): void {
    if (window.confirm('Are you sure you want to save?')) {
      event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this.babyformulaservice.updateBabyFormula(event.newData.$key, event.newData);

    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {

    event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

    this.babyformulaservice.createBabyFormula(event.newData);

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
    var gethttpcsv = Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYPHdJeoEEjun_d_H_GX96mrvDQUn9oBLbou6jMNnIZxtyHzKcCtpR72BFmJZuQUfJI812ma7Tw8h/pub?output=csv', {
                            download: true,
                            header: true,
                            dynamicTyping: true,
                            complete: (results) => {
                              this.importhttpcsv(results);
                            }
                });
  }

  importhttpcsv(results) {
    this.babyformulaservice.deleteAll();

    results.data.forEach(item => {
      let tarr = item as BabyFormula;
      // console.log(tarr);
      this.babyformulaservice.bulkcreateBabyFormula(tarr);
    });

    this.babyformula
      .subscribe(babyformulalist => {
        this.localDataSource.load(babyformulalist);
        this.localDataSource.refresh();
      });

  }



}

