import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { AuthModalComponent } from '../auth/auth-modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, AuthModalComponent]
})
export class HeaderComponent {
  title = 'StockTrac';
  showAuthModal = false;
  showProfileMenu = false;

  constructor(
    public sidenavService: SidenavService,
    public authService: AuthService,
    private router: Router
  ) {}

  toggleAuthModal() {
    this.showAuthModal = !this.showAuthModal;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.showProfileMenu = false;
  }
}