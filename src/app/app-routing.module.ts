import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { AuthModule } from './share/auth/auth.module';
import { AuthGuard } from './share/auth/auth.guard';
import { UserLoginComponent } from './ui/user-login/user-login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: UserLoginComponent, },
  { path: 'freetpn', loadChildren: './freetpn/freetpn.module#FreetpnModule',  canActivate: [AuthGuard]},
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule',  canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
