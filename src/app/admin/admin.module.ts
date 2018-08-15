import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrimeNGModule } from '../share/UIComponents/primeng.module';
import { MaterialModule } from '../share/UIComponents/material.module';

import { routes } from './adminbase.routing';
import { AdminBaseComponent } from './adminbase/AdminBase.component';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    PrimeNGModule,
    MaterialModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule
  ],
  declarations: [AdminBaseComponent],
  providers: []
})
export class AdminModule {
  public static routes = routes;
 }
