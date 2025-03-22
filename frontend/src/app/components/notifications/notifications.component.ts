import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  message: string | null = null;
  type: boolean | null = null;
  private subscriptions: Subscription[] = [];
  private autoCloseTimeout: any;

  constructor(public _ns: NotificationsService) { }

  ngOnInit(): void {
    const messageSub = this._ns.message$.subscribe((msg) => {
      this.message = msg;
    });
    
    const typeSub = this._ns.type$.subscribe((type) => {
      this.type = type;
    });
    
    this.subscriptions.push(messageSub, typeSub);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  }
}