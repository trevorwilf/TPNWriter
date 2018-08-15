import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../sharedui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PrimeNGModule } from '../../share/UIComponents/primeng.module';
import { Menu } from 'primeng/components/menu/menu';
import { MenuItem } from 'primeng/primeng';

import { NavService } from './nav.service';

import { UserLoginComponent } from '../user-login/user-login.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    NgbModule,
    PrimeNGModule
  ],
  declarations: [
    UserLoginComponent,
    TopNavComponent,
    FooterNavComponent,
    UserFormComponent
  ],
  exports: [
    TopNavComponent,
    FooterNavComponent,
    PrimeNGModule
  ]
})
export class UiModule { }
