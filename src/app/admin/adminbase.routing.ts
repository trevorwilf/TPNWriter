import { AdminBaseComponent } from './adminbase/AdminBase.component';

import { AuthGuard } from '../share/auth/auth.guard';

export const routes = [
  { path: '', children: [
    { path: '', component: AdminBaseComponent, pathMatch: 'full'},
    { path: 'tpncalcadmin', loadChildren: './tpncalcadmin/tpncalcadmin.module#TpncalcadminModule'},
  ]},
];
