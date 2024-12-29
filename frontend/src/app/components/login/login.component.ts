import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginDetails } from '../../interfaces/interfaces';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, TopbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  errBorder = {
    'border': '1px solid red'
  }

  loginUser(logins: LoginDetails) {
    console.log(logins);
  }

}
