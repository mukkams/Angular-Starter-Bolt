import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/sidenav/sidenav.component';
import { SidenavService } from './services/sidenav.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    HeaderComponent, 
    SideNavComponent, 
    CommonModule, 
    RouterModule
  ]
})
export class App {
  title = 'StockTrac';

  constructor(public sidenavService: SidenavService) {}
}