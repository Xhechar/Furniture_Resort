import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HandlerService } from '../../../services/handler.service';
import { TopBar } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-user-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
    { value: 'Profile', route: 'my-profile', icon: 'bx bx-user-pin' },
    { value: 'Logout', route: '/logout', icon: 'bx bx-log-out' },
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
