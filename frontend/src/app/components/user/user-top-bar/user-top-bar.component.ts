import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from '../../../services/handler.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/interfaces';
import { NotificationsComponent } from "../../notifications/notifications.component";
import { NotificationsService } from '../../../services/notifications.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-top-bar',
  standalone: true,
  imports: [NotificationsComponent, CommonModule],
  templateUrl: './user-top-bar.component.html',
  styleUrl: './user-top-bar.component.css'
})
export class UserTopBarComponent implements OnInit {
  parent: string = '';
  child: string = '';
  user!: User;
  now : Date = new Date();

  constructor(private router: Router, private hs: HandlerService, private us: UserService, private ns: NotificationsService) {
    let route = router.url;
    this.fetchUser();
  }

  fetchUser() : User | void {
    let ns = this.ns;
    this.us.getSingleUser().subscribe({
      next: (value) => {
        if(value.success) {
          this.user = value.user as User;
        } else {
          ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        ns.showMessage(error.error.error as string, false);
      }
    });
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
  }

}
