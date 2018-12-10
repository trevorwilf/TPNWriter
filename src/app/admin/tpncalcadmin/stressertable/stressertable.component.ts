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

import { Stressors, Stressorstable } from '../../../share/DB_Values/Stressor';
import { StressorsAdminService } from './stresseradmin.service';

// Observable class extensions



// Observable operators









@Component({
  selector: 'app-stressortable',
  templateUrl: 'stressertable.component.html',
  styleUrls: ['stressertable.component.css']
})

export class StressortableComponent implements OnInit {

  fileReaded: any;
  public stressor: any;
  $update: Observable<any>;
  localDataSource: LocalDataSource = new LocalDataSource();
  Stressorstable = Stressorstable.stress;

  constructor(private stressorservice: StressorsAdminService) {
    this.stressor = this.stressorservice.getStressersList();

    this.stressor.subscribe(stressorlist => {
      this.localDataSource.load(stressorlist);
      this.localDataSource.refresh();
    });

    // for writing to console for troubleshooting
    // this.ivroutes.subscribe(x => {
    //  console.log(x);
    // });
  }

  ngOnInit() {
    this.stressor.subscribe(x => {});
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
      this.stressorservice.deleteStresser(event.data.$key);
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event): void {
    if (window.confirm('Are you sure you want to save?')) {
      event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this.stressorservice.updateStresser(event.newData.$key, event.newData);

    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {

    event.newData.timestamp = firebase.database.ServerValue.TIMESTAMP;

    this.stressorservice.createStresser(event.newData);

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
    var gethttpcsv = Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vQR16KgFJgS1eY4QDb8cG5tI_-wAXFId7BMpM3gj0Y3CgSPXd2mS6IM_bvn4w5n1PCO3leJ0mJgDXjo/pub?output=csv', {
                            download: true,
                            header: true,
                            dynamicTyping: true,
                            complete: (results) => {
                              this.importhttpcsv(results);
                            }
                });
  }

  importhttpcsv(results) {
    this.stressorservice.deleteAll();

    results.data.forEach(item => {
      let tarr = item as Stressors;
      // console.log(tarr);
      this.stressorservice.bulkcreateStresser(tarr);
    });

    this.stressor.subscribe(stressorlist => {
      this.localDataSource.load(stressorlist);
      this.localDataSource.refresh();
    });

  }


}


