import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationsService } from '../../services/notifications.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit{
  isVisible = false;
  isLoggingOut = false;
  logoutComplete = false;
  logoutMessage = 'Logging out...';
  
  constructor(private router: Router, private ns: NotificationsService, private ms: ModalService) {}

  public ngOnInit(): void {
    this.ms.isVisible$.subscribe(res => {
      this.isVisible = res;
    })
  }
  
  public show(): void {
    this.isVisible = true;
    
    document.addEventListener('keydown', this.handleEscKey);
  }
  
  public hide(): void {
    this.isVisible = false;
    document.removeEventListener('keydown', this.handleEscKey);
  }
  
  public logout(): void {
    this.isLoggingOut = true;
    
    localStorage.removeItem('authToken');
    
    this.logoutComplete = true;
    this.logoutMessage = 'Logged out successfully!';
    this.ns.showMessage(this.logoutMessage, true);
    
    setTimeout(() => {
      this.router.navigate(['/']);
      this.isVisible = false;
      this.reset();
      this.cancel();
    }, 6000);
  }
  
  public cancel(): void {
    this.hide();
  }
  
  private handleEscKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isVisible && !this.isLoggingOut) {
      this.cancel();
    }
  }
  
  private reset(): void {
    setTimeout(() => {
      this.isLoggingOut = false;
      this.logoutComplete = false;
      this.logoutMessage = 'Logging out...';
      document.removeEventListener('keydown', this.handleEscKey);
    }, 300);
  }
  
  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscKey);
  }
}