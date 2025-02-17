import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();
  isLogin = true;

  private router = inject(Router);
  private authService = inject(AuthService);
  
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;

  setMode(isLogin: boolean) {
    this.isLogin = isLogin;
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.isLogin) {
      if (this.email === 'sunil.mukkamala@gmail.com' && this.password === 'Welcome#1') {
        this.authService.login(this.email);
        this.closeModal();
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    } else {
      console.log('Register:', { email: this.email, password: this.password });
    }
  }

  socialLogin(provider: 'google' | 'facebook' | 'github') {
    console.log(`Login with ${provider}`);
  }

  closeModal() {
    this.close.emit();
  }
}