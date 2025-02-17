import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private isOpen = new BehaviorSubject<boolean>(true);
  isOpen$ = this.isOpen.asObservable();

  toggle() {
    this.isOpen.next(!this.isOpen.value);
  }
}