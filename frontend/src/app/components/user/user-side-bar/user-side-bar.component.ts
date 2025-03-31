import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HandlerService } from '../../../services/handler.service';
import { TopBar } from '../../../interfaces/interfaces';
import { ModalService } from '../../../services/modal.service';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-user-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoutComponent],
  templateUrl: './user-side-bar.component.html',
  styleUrl: './user-side-bar.component.css',
})
export class UserSideBarComponent {
  menuItems = [
    { value: 'Products', route: 'products', icon: 'bx bx-book-content' },
    { value: 'Cart', route: 'cart', icon: 'bx bx-cart-alt' },
    { value: 'Orders', route: 'orders', icon: 'bx bx-shopping-bag' },
    { value: 'Reviews', route: 'my-reviews', icon: 'bx bxs-star-half' },
    {
      value: 'Order Progress',
      route: 'my-progresses',
      icon: 'bx bx-purchase-tag-alt',
    },
    { value: 'Messages', route: 'my-messages', icon: 'bx bx-conversation' },
    { value: 'Wishlists', route: 'my-wishlist', icon: 'bx bx-bookmarks' },
    { value: 'Profile', route: 'my-profile', icon: 'bx bx-user-pin' }
  ];

  selectedIndex = 0;
  isSidebarCollapsed = false;
  screenWidth: number;

  constructor(private router: Router, private hs: HandlerService, private ms: ModalService) {
    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
    
    const currentRoute = this.router.url.split('/').pop() || '';
    const foundIndex = this.menuItems.findIndex((item) => item.route === currentRoute);
    if (foundIndex !== -1) {
      this.selectedIndex = foundIndex;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (this.screenWidth <= 768) {
      this.isSidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  setIndex(index: number) {
    this.selectedIndex = index;
    
    // If on mobile, collapse sidebar after selection
    if (this.screenWidth <= 768) {
      this.isSidebarCollapsed = true;
    }
    
    const routeParts = this.router.url.split('/');
    let navPath: TopBar = {
      parent: routeParts.length > 1 ? routeParts[1] : '',
      child: this.menuItems[index].value
    }
    this.hs.setTopBar(navPath);
  }

  showLogoutModal(): void {
    console.log("I'm definately clicked.");
    
    this.ms.toggleLogout(true);
  }
}