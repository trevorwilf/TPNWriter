import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { AuthService } from '../../share/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGModule } from '../../share/UIComponents/primeng.module';
import { Menu } from 'primeng/components/menu/menu';
import { MenuItem } from 'primeng/primeng';

import { ErrorService } from '../../share/debug/error.service';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})

export class TopNavComponent implements OnInit {
  menuItems: MenuItem[];
  miniMenuItems: MenuItem[];
  menuItemsauth: MenuItem[];
  miniMenuItemsauth: MenuItem[];

  @ViewChild('bigMenu') bigMenu: Menu;
  @ViewChild('smallMenu') smallMenu: Menu;
  @ViewChild('bigMenuauth') bigMenuauth: Menu;
  @ViewChild('smallMenuauth') smallMenuauth: Menu;

  constructor(public auth: AuthService,
    private router: Router,
    private _err: ErrorService) {}

  ngOnInit() {


    // this._err.writetoconsole(this.auth.authState)

    this.menuItems = [
      {
        label: 'Home',
        icon: 'fa-home',
        routerLink: ['./home']
      },
      {
        label: 'Logon',
        icon: 'fa fa-user-circle',
        routerLink: ['./login']
      }
    ];

    this.miniMenuItems = [];
    this.menuItems.forEach((item: MenuItem) => {
      const miniItem = { icon: item.icon, routerLink: item.routerLink };
      this.miniMenuItems.push(miniItem);
    });

    // authed menu
    this.menuItemsauth = [
      {
        label: 'Home',
        icon: 'fa-home',
        routerLink: ['./home']
      },
      {
        label: 'Free TPN',
        icon: 'fa fa-user-md',
        routerLink: ['./freetpn']
      },
      {
        label: 'Admin',
        icon: 'fa fa-lock',
        routerLink: ['./admin']
      },
      {
        label: 'LogOut',
        icon: 'fa fa-sign-out',
        command: event => {
          this.logout();
        }
      }
    ];

    this.miniMenuItemsauth = [];
    this.menuItemsauth.forEach((item: MenuItem) => {
      const miniItem = { icon: item.icon, routerLink: item.routerLink };
      this.miniMenuItemsauth.push(miniItem);
    });

  }

  logout() {
    this.auth.signOut();
  }

}
