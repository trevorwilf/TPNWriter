import { FreetpnComponent } from './freetpn.component';
import { AuthGuard } from '../share/auth/auth.guard';


export const routes = [
  { path: '', children: [
    { path: '', component: FreetpnComponent, pathMatch: 'full' }
  ]},
];


//{ path: '', pathMatch: 'full', redirectTo: 'home' },
//{ path: 'home', component: HomeComponent },
//{ path: 'login', component: UserLoginComponent, },
//{ path: 'freetpn', loadChildren: './freetpn/freetpn.module#FreetpnModule',  canActivate: [AuthGuard]}
