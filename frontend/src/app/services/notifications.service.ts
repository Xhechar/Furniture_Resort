import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private messageSubject = new BehaviorSubject<string | null>(null);
  private typeSubject = new BehaviorSubject<boolean | null>(null);

  message$: Observable<string | null> = this.messageSubject.asObservable();
  type$: Observable<boolean | null> = this.typeSubject.asObservable();

  showMessage(message: string | null, type: boolean | null) {
    this.messageSubject.next(message);
    this.typeSubject.next(type);

    setTimeout(() => {
      this.clearNotification();
    }, 3000);
  }

  clearNotification() {
    this.messageSubject.next(null);
    this.typeSubject.next(null);
  }
}
