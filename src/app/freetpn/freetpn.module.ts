import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreetpnComponent } from './freetpn.component';
import { routes } from './freetpn.routing';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PrimeNGModule } from '../share/UIComponents/primeng.module';
import { MaterialModule } from '../share/UIComponents/material.module';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IIVRoutesService } from './freetpnshare/ivroute.service';
import { StressorsService } from './freetpnshare/stressor.service';
import { FreeTPNDataService } from './freetpnshare/freetpndata.service';
import { BabyFormulaService } from './freetpnshare/babyformula.service';
import { UserPreferencesService } from './userpreferences/userpreferences.service';

import { UserinfoComponent } from './userinfo/userinfo.component';
import { UserPreferenceComponent } from './userpreferences/userpreferences.component';
import { UserInfoService } from './userinfo/userinfo.service';
import { PatientinfoComponent } from './patientinfo/patientinfo.component';
import { TodaysobservationsComponent } from './todaysobservations/todaysobservations.component';
import { FluidsinfoComponent } from './fluids/fluids.component';
import { MacrosinfoComponent } from './macros/macros.component';
import { ElectrolyteinfoComponent } from './electrolytes/electrolytes.component';
import { AdditiveinfoComponent } from './additives/additives.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    MaterialModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule
  ],
  providers: [
    IIVRoutesService,
    UserInfoService,
    StressorsService,
    FreeTPNDataService,
    BabyFormulaService,
    UserPreferencesService
    ],
  declarations: [
    FreetpnComponent,
    UserinfoComponent,
    UserPreferenceComponent,
    PatientinfoComponent,
    TodaysobservationsComponent,
    FluidsinfoComponent,
    MacrosinfoComponent,
    ElectrolyteinfoComponent,
    AdditiveinfoComponent]
})
export class FreetpnModule { }
