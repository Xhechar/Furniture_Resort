import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { NotificationsService } from '../../../services/notifications.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-a-profile',
  standalone: true,
  imports: [CommonModule, NotificationsComponent, FormsModule],
  templateUrl: './a-profile.component.html',
  styleUrl: './a-profile.component.css'
})
export class AProfileComponent implements OnInit {
  user!: User;
  isBackgroundUploading: boolean = false;
  isProfileUploading: boolean = false;
  isUpdating: boolean = false;

  constructor(private us: UserService, private ns: NotificationsService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    this.us.getSingleUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.user as User;
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  uploadBackgroundImage(event: any) {
    let image = event.target.files[0];

    if (image) {
      this.isBackgroundUploading = true;
      let formData = new FormData();

      formData.append('file', image);
      formData.append('upload_preset', 'furniture_api');
      formData.append('cloud_name', 'dbdsfkcev');

      fetch('https://api.cloudinary.com/v1_1/dbdsfkcev/image/upload', {
        method: 'POST',
        body: formData
      }).then(res => res.json()).then(res => {
        this.us.updateBackgroundPhoto(res.secure_url).subscribe({
          next: (response) => {
            if (response.success) {
              this.ns.showMessage(response.message as string, response.success);
              this.user.BackgroundWallpaper = res.url;
              this.isBackgroundUploading = false;
            } else {
              this.ns.showMessage(response.error as string, false);
              this.isBackgroundUploading = false;
            }
          },
          error: (error) => {
            this.ns.showMessage(error.error.error as string, false);
            this.isBackgroundUploading = false;
          }
        })
      })
    } else {
      this.ns.showMessage("Background imae is required.", false);
    }
  }

  uploadProfileImage(event: any) {
    let image = event.target.files[0];

    if (!image) {
      this.ns.showMessage('Profile image is required.', false);
    } else {
      this.isProfileUploading = true;

      let formData = new FormData();

      formData.append('file', image);
      formData.append('upload_preset', 'furniture_api');
      formData.append('cloud_name', 'dbdsfkcev');

      fetch('https://api.cloudinary.com/v1_1/dbdsfkcev/image/upload', {
        method: 'POST',
        body: formData
      }).then(res => res.json()).then(res => {
        this.us.updateProfileImage(res.secure_url).subscribe({
          next: (response) => {
            if (response.success) {
              this.ns.showMessage(response.message as string, response.success);
              this.user.ProfileImage = res.url;
              this.isProfileUploading = false;
            } else {
              this.ns.showMessage(response.error as string, false);
              this.isProfileUploading = false;
            }
          },
          error: (error) => {
            this.ns.showMessage(error.error.error as string, false);
            this.isProfileUploading = false;
          }
        })
      })
    }
  }

  updateProfile(user: Partial<User>): void {
    this.isUpdating = true;
    this.us.updateUser(user).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, response.success);
          this.isUpdating = false;
        } else {
          this.ns.showMessage(response.error as string, false);
          this.isUpdating = false;
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
        this.isUpdating = false;
      }
    });
  }
}
