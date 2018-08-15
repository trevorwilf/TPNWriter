import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalcAdminComponent } from './calcadmin/calcadmin.component';
import { IVroutestableComponent } from './ivroutestable/ivroutestable.component';
import { StressortableComponent } from './stressertable/stressertable.component';
import { ElectrolytetableComponent } from './electrolytetable/electrolytetable.component';
import { BabyFormulatableComponent} from './babyformula/babyformulaadmintable.component';
import { LipidtableComponent} from './lipid/lipidtable.component';

import { AuthGuard } from '../../share/auth/auth.guard';

export const routes = [
  { path: '', children: [
    { path: '', component: CalcAdminComponent, pathMatch: 'full' },
    { path: 'ivroute', component: IVroutestableComponent, pathMatch: 'full' },
    { path: 'stress', component: StressortableComponent, pathMatch: 'full' },
    { path: 'Electrolytedetail', component: ElectrolytetableComponent, pathMatch: 'full' },
    { path: 'babyformula', component: BabyFormulatableComponent, pathMatch: 'full' },
    { path: 'lipids', component: LipidtableComponent, pathMatch: 'full' }
  ]},
];

// @NgModule({
//   imports: [RouterModule.forChild(tpncalcadminroutes)],
//   exports: [RouterModule]
// })

// export class TpncalcadminRoutingModule { }
