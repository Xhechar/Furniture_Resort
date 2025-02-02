import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserSideBarComponent } from './user-side-bar/user-side-bar.component';
import { UserTopBarComponent } from './user-top-bar/user-top-bar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLink, UserSideBarComponent, UserTopBarComponent, RouterOutlet],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
