import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminSideBarComponent } from './admin-side-bar/admin-side-bar.component';
import { UserTopBarComponent } from '../user/user-top-bar/user-top-bar.component';
import { AdminTopBarComponent } from './admin-top-bar/admin-top-bar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, AdminSideBarComponent, AdminTopBarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
 
}
