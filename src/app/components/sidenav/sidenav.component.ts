import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NavMenuComponent]
})
export class SideNavComponent implements OnInit {
  isDesktop = false;

  constructor(public sidenavService: SidenavService) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 1024;
  }
}