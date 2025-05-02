import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TopBar } from '../../../interfaces/interfaces';
import { HandlerService } from '../../../services/handler.service';
import { LogoutComponent } from '../../logout/logout.component';
import { ModalService } from '../../../services/modal.service';
import { SidebarService } from '../../../services/modifiers/sidebar.service';

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoutComponent],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent implements OnInit {
  menuItems = [
    { value: 'Dashboard', route: 'dashboard', icon: 'bx bxs-dashboard' },
    { value: 'Products', route: 'products', icon: 'bx bx-list-ul' },
    { value: 'Reviews', route: 'user-reviews', icon: 'bx bxs-star' },
    { value: 'Progresses', route: 'user-progresses', icon: 'bx bxs-objects-vertical-top bx-rotate-180' },
    { value: 'Messages', route: 'admin-messages', icon: 'bx bxs-chat' },
    { value: 'Users', route: 'users', icon: 'bx bxs-group' },
    { value: 'Orders', route: 'user-orders', icon: 'bx bx-task' },
    { value: 'Categories', route: 'user-categories', icon: 'bx bxs-basket' },
    { value: 'Profile', route: 'a-profile', icon: 'bx bxs-user-circle' }
  ];

  show: boolean = false;
  selectedIndex = 0;
  
  constructor(private router: Router, private hs: HandlerService, private ms: ModalService, private ss: SidebarService) {
    const currentRoute = this.router.url.split('/').pop() || '';
    const foundIndex = this.menuItems.findIndex((item) => item.route === currentRoute);
    if (foundIndex !== -1) {
      this.selectedIndex = foundIndex;
    }
  }

  ngOnInit(): void {
    this.ss.sidebarState$.subscribe(res => {
      this.show = res;
    });
  }

  setIndex(index: number) {
    this.selectedIndex = index;
    let navPath: TopBar = {
      parent: `${this.router.url.split('/')[1]}`,
      child: this.menuItems[index].value
    }
    this.hs.setTopBar(navPath);

    if (window.innerWidth < 768) {
      this.ss.toggleSidebar();
    }
  }

  displayLogoutModal() {
    this.ms.toggleLogout(true);
  }
}