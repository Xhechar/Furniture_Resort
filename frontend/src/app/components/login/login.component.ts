import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginDetails } from '../../interfaces/interfaces';
import { TopbarComponent } from '../topbar/topbar.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { UserService } from '../../services/user.service';
import { NotificationsService } from '../../services/notifications.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, TopbarComponent, NotificationsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private _as: AuthService, private _ns: NotificationsService, private router: Router) { }; 

  loginUser(logins: LoginDetails) {
    console.log(logins);
    
    this._as.loginUser(logins).subscribe({
      next: (response) => {
        if (response.success) {
          this._ns.showMessage(response.message as string, response.success);
          
          if (response.Role == 'user') {
            this.router.navigate(['/user']);
          } else if (response.Role == 'admin') {
            this.router.navigate(['/admin']);
          }
        } else {
          this._ns.showMessage(response.error as string, response.success);
        }
      },
      error: (error) => {
        this._ns.showMessage(error.error.error as string, false);
      }
    })
  }

}
