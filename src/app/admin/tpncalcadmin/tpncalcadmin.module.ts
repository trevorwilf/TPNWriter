import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrimeNGModule } from '../../share/UIComponents/primeng.module';
import { MaterialModule } from '../../share/UIComponents/material.module';

import { CalcAdminComponent } from './calcadmin/calcadmin.component';
import { routes } from './tpncalcadmin.routing';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { StressortableComponent } from './stressertable/stressertable.component';
import { StressorsAdminService } from './stressertable/stresseradmin.service';

import { IIVRoutesAdminService } from './ivroutestable/ivrouteadmin.service';
import { IVroutestableComponent } from './ivroutestable/ivroutestable.component';

import { ElectrolytesAdminService } from './electrolytetable/electrolyteadmin.service';
import { ElectrolytetableComponent } from './electrolytetable/electrolytetable.component';

import { BabyFormulaAdminService } from './babyformula/babyformulaadmin.service';
import { BabyFormulatableComponent} from './babyformula/babyformulaadmintable.component';

import { ILipidsAdminService } from './lipid/lipidadmin.service';
import { LipidtableComponent} from './lipid/lipidtable.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    PrimeNGModule,
    MaterialModule
  ],
  declarations: [CalcAdminComponent,
    StressortableComponent,
    LipidtableComponent,
    BabyFormulatableComponent,
    ElectrolytetableComponent,
    IVroutestableComponent,

  ],
  providers: [
    StressorsAdminService,
    ILipidsAdminService,
    BabyFormulaAdminService,
    ElectrolytesAdminService,
    IIVRoutesAdminService,


  ]
})
export class TpncalcadminModule {
  public static routes = routes;
}
