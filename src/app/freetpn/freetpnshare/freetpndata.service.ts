import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BehaviorSubject ,  Subscription ,  Observable ,  of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, tap, map } from 'rxjs/operators';







import { ErrorService } from '../../share/debug/error.service';

import { PatientinfoComponent } from '../patientinfo/patientinfo.component';

// Interfaces
import { IPatient } from '../../share/DB_Values/patient-interface';
import { IIVRoutes } from '../../share/DB_Values/IVRoute';
import { IPatientObservations } from '../../share/DB_Values/observations-interface';
import { Electrolytedetail } from '../../share/DB_Values/Electrolytes';
import { Stressors } from '../../share/DB_Values/Stressor';
import { IFluids } from '../../share/DB_Values/fluids';
import { IMacros } from '../../share/DB_Values/macros';
import { IElectrolyte } from '../../share/DB_Values/Electrolytes';
import { IAdditive } from '../../share/DB_Values/additives';
import { IWriterPrefs } from '../../share/DB_Values/WriterPrefs';


@Injectable()

// this service is for sharing data between components

export class FreeTPNDataService {
  private UserPrefInfoSource: BehaviorSubject<IWriterPrefs> = new BehaviorSubject<IWriterPrefs>(null);
  public CurrentUserPrefInfo: Observable<IWriterPrefs> = this.UserPrefInfoSource.asObservable();

  private PatientInfoSource: BehaviorSubject<IPatient> = new BehaviorSubject<IPatient>(null);
  public CurrentPatientInfo: Observable<IPatient> = this.PatientInfoSource.asObservable();

  private TodaysInfoSource: BehaviorSubject<IPatientObservations> = new BehaviorSubject<IPatientObservations>(null);
  public CurrentTodaysInfo: Observable<IPatientObservations> = this.TodaysInfoSource.asObservable();

  private FluidsInfoSource: BehaviorSubject<IFluids> = new BehaviorSubject<IFluids>(null);
  public CurrentFluidsInfo: Observable<IFluids> = this.FluidsInfoSource.asObservable();

  private MacrosInfoSource: BehaviorSubject<IMacros> = new BehaviorSubject<IMacros>(null);
  public CurrentMacrosInfo: Observable<IMacros> = this.MacrosInfoSource.asObservable();

  private ElectrolyteInfoSource: BehaviorSubject<IElectrolyte> = new BehaviorSubject<IElectrolyte>(null);
  public CurrentElectrolyteInfo: Observable<IElectrolyte> = this.ElectrolyteInfoSource.asObservable();

  private AdditiveInfoSource: BehaviorSubject<IAdditive> = new BehaviorSubject<IAdditive>(null);
  public CurrentAdditiveInfo: Observable<IAdditive> = this.AdditiveInfoSource.asObservable();

  // private PatientInfoSource: BehaviorSubject<IPatient> = new BehaviorSubject<IPatient>(null);
  // public CurrentPatientInfo: Observable<IPatient> = this.PatientInfoSource.asObservable();

  constructor(private _err: ErrorService) { }

  // these need to be called from the source modules in order to update the values
  changePatientInfoSource(update: IPatient) {
    this.PatientInfoSource.next(update);
    this._err.writetoconsole(this.CurrentPatientInfo);
    // console.log(this.CurrentPatientInfo);
  }

  changeTodaysInfoSource(update: IPatientObservations) {
    this.TodaysInfoSource.next(update);
    // console.log(this.TodaysInfoSource);
  }

  changeFluidsInfoSource(update: IFluids) {
    this.FluidsInfoSource.next(update);
    // console.log(this.FluidsInfoSource);
  }

  changeMacrosInfoSource(update: IMacros) {
    this.MacrosInfoSource.next(update);
    // console.log(this.MacrosInfoSource);
  }

  changeElectrolyteInfoSource(update: IElectrolyte) {
    this.ElectrolyteInfoSource.next(update);
    // console.log(this.ElectrolyteInfoSource);
  }

  changeAdditiveInfoSource(update: IAdditive) {
    this.AdditiveInfoSource.next(update);
    // console.log(this.AdditiveInfoSource);
  }

  changeCurrentUserPrefInfo(update: IWriterPrefs) {
    this.UserPrefInfoSource.next(update);
    // console.log(this.UserPrefInfoSource);
  }
}
