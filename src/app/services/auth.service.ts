import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  email: string;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  constructor() {
    // Check local storage on initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user.next(JSON.parse(storedUser));
    }
  }

  login(email: string) {
    const user: User = {
      email,
      isLoggedIn: true
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.user.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.user.next(null);
  }
}