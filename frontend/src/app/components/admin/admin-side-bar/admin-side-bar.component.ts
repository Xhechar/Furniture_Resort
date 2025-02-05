import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TopBar } from '../../../interfaces/interfaces';
import { HandlerService } from '../../../services/handler.service';

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent {
  // users - update role, delete users (multiple), restore, getdeleted, allnusers
  //products - categories, 
  //orders -custom & orders, delivered, custom delivered
  menuItems = [
    { value: 'Dashboard', route: 'dashboard', icon: 'bx bxs-dashboard' },
    { value: 'Products', route: 'products', icon: 'bx bx-list-ul' },
    { value: 'Activated Products', route: 'activated-products', icon: 'bx bx-list-check' },
    { value: 'On Offer Products', route: 'on-offer-products', icon: 'bx bxs-offer' },
    { value: 'On Flush Products', route: 'on-flush-products', icon: 'bx bxs-flag' },
    { value: 'Reviews', route: 'user-reviews', icon: 'bx bxs-star' },
    { value: 'Progresses', route: 'user-progresses', icon: 'bx bxs-objects-vertical-top bx-rotate-180' },
    { value: 'Completed Progresses', route: 'user-completed-progresses', icon: "bx bxs-objects-vertical-top bx-rotate-180' style='color:#0f3904" },
    { value: 'Messages', route: 'admin-messages', icon: 'bx bxs-chat' },
    { value: 'Inactive Users', route: 'deleted-users', icon: 'bx bxs-user-x' },
    { value: 'Orders', route: 'user-orders', icon: 'bx bx-task-x' },
    { value: 'Delivered Orders', route: 'delivered-orders', icon: 'bx bx-task' },
    { value: 'Users', route: 'users', icon: 'bx bxs-group' },
    { value: 'Custom Orders', route: 'user-custom-orders', icon: 'bx bxs-shopping-bags' },
    { value: 'Delivered Custom Orders', route: 'user-delivered-orders', icon: 'bx bxs-shopping-bags' },
    { value: 'Categories', route: 'user-categories', icon: 'bx bxs-basket' },
    { value: 'Profile', route: 'a-profile', icon: 'bx bxs-user-circle' },
    { value: 'Logout', route: '/logout', icon: 'bx bxs-log-out' },
  ];

  selectedIndex = 0;

  constructor(private router: Router, private hs: HandlerService) {
    const currentRoute = this.router.url;
    const foundIndex = this.menuItems.findIndex((item) => item.route === currentRoute);
    if (foundIndex!== -1) {
      this.selectedIndex = foundIndex;
    }
  }

  setIndex(index: number) {
    this.selectedIndex = index;
    let navPath: TopBar = {
      parent: `${this.router.url.split('/')[1]}`,
      child: this.menuItems[index].value
    }
    this.hs.setTopBar(navPath);
  }
}
