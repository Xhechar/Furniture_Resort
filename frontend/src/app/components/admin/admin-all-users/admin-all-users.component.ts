import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-all-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-all-users.component.html',
  styleUrl: './admin-all-users.component.css'
})
export class AdminAllUsersComponent {
  users = [
    {
      Fullname: 'John Doe',
      Email: 'johndoe@example.com',
      Mobile: '1234567890',
      Country: 'USA',
      City: 'New York',
      Gender: 'Male',
      IdentificationNumber: 123456,
      ProfileImage: 'https://via.placeholder.com/50',
      BackgroundWallpaper: '',
      Password: 'secret',
      IsWelcomed: true,
      IsDeleted: false,
      DateCreated: new Date('2023-01-01'),
      HasOrder: true,
      HasWishList: false,
      Role: 'user',
      Selected: false
    },
    {
      Fullname: 'Jane Smith',
      Email: 'janesmith@example.com',
      Mobile: '0987654321',
      Country: 'Canada',
      City: 'Toronto',
      Gender: 'Female',
      IdentificationNumber: 654321,
      ProfileImage: 'https://via.placeholder.com/50',
      BackgroundWallpaper: '',
      Password: 'secret',
      IsWelcomed: true,
      IsDeleted: true,
      DateCreated: new Date('2023-02-15'),
      HasOrder: false,
      HasWishList: true,
      Role: 'user',
      Selected: false
    }
    // Add more users as needed
  ];

  // Action methods (implement your logic here)
  deleteUser(user: any) {
    console.log('Deleting user:', user);
    // Add deletion logic here
  }

  activateUser(user: any) {
    console.log('Activating user:', user);
    // Add activation logic here
  }
}
