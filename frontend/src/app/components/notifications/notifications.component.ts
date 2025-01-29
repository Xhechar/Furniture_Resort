import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit{
  message: string | null = null;
  type: boolean | null = null;

  constructor(private _ns: NotificationsService) { }

  ngOnInit(): void {
    this._ns.message$.subscribe((msg) => {
      this.message = msg;
    });
    this._ns.type$.subscribe((type) => {
      this.type = type;
    });
  }
}
