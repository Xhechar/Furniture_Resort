import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from '../../../services/handler.service';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/interfaces';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-admin-top-bar',
  standalone: true,
  imports: [NotificationsComponent],
  templateUrl: './admin-top-bar.component.html',
  styleUrl: './admin-top-bar.component.css'
})
export class AdminTopBarComponent implements OnInit {
  parent: string = '';
  child: string = '';
  user!: User;

  constructor(private router: Router, private hs: HandlerService, private us: UserService, private ns: NotificationsService ) {
    let route = router.url;
  }

  ngOnInit(): void {
    this.hs.topBar$.subscribe(res => {
      if (!res) {
        this.parent = 'Dashboard';
        this.child = 'products';
      } else {
        this.parent = res.parent;
        this.child = res.child;
      }
    });

    this.loadUser();
  }

  loadUser() {
    this.us.getSingleUser().subscribe({
      next: (value) => {
        if (value.success) {
          this.user = value.user as User;
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }
}
