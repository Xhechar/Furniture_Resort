import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
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
  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(private _as: AuthService, private _ns: NotificationsService, private router: Router) {}; 

  loginUser(logins: LoginDetails) {
    this._as.loginUser(logins).subscribe({
      next: (response) => {
        if (response.success) {
          this._ns.showMessage(response.message as string, response.success);
          
          if (response.Role == 'user') {
            setTimeout(() => {
              this.router.navigate(['/user']);
            }, 6000);
          } else if (response.Role == 'admin') {
            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 6000);
          }
        } else {
          this._ns.showMessage(response.error as string, response.success);
        }
      },
      error: (error) => {
        this._ns.showMessage(error.error.error as string, false);
      }
    });
    this.loginForm.reset();
  }

}
