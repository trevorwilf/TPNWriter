import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';

@NgModule({
  providers: [AuthService,
  AuthGuard],
  imports: [AngularFireAuthModule]
})
export class AuthModule { }
