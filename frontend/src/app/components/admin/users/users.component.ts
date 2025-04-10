import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user.service';
import { NotificationsComponent } from "../../notifications/notifications.component";
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  activeUsers: User[] = [];
  deletedUsers: User[] = [];
  adminUsers: User[] = [];
  

  selectedUsers: string[] = [];
  
  activeSection: 'all' | 'active' | 'deleted' | 'admin' = 'all';
  
  searchTerm: string = '';
  filters = {
    country: '',
    gender: '',
    dateFrom: '',
    dateTo: ''
  };
  
  uniqueCountries: string[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  showDeleteModal: boolean = false;
  userToDelete: User | null = null;

  constructor(private us: UserService, private ns: NotificationsService) { }

  ngOnInit(): void {
    this.fetchUsers();
    
    this.initializeFilterOptions();
    
    this.applyFilters();
  }

  fetchUsers(): void {
    
    this.us.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users as User[];
          this.filteredUsers = [...this.users];
          this.updateUserGroups();
          this.initializeFilterOptions();
          this.applyFilters();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
  }

  initializeFilterOptions(): void {
    this.uniqueCountries = [...new Set(this.users.map(user => user.Country))];
  }

  updateUserGroups(): void {
    this.activeUsers = this.users.filter(user => !user.IsDeleted);
    this.deletedUsers = this.users.filter(user => user.IsDeleted);
    this.adminUsers = this.users.filter(user => user.Role === 'Admin');
  }

  setActiveSection(section: 'all' | 'active' | 'deleted' | 'admin'): void {
    this.activeSection = section;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    // First, filter by section
    let sectionFiltered: User[] = [];
    
    switch (this.activeSection) {
      case 'all':
        sectionFiltered = [...this.users];
        break;
      case 'active':
        sectionFiltered = [...this.activeUsers];
        break;
      case 'deleted':
        sectionFiltered = [...this.deletedUsers];
        break;
      case 'admin':
        sectionFiltered = [...this.adminUsers];
        break;
    }

    this.filteredUsers = sectionFiltered.filter(user => {

      const searchMatch = this.searchTerm === '' || 
        user.Fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.UserId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const countryMatch = this.filters.country === '' || user.Country === this.filters.country;
      
      const genderMatch = this.filters.gender === '' || user.Gender === this.filters.gender;
      
      let dateMatch = true;
      if (this.filters.dateFrom) {
        const fromDate = new Date(this.filters.dateFrom);
        dateMatch = dateMatch && user.DateCreated >= fromDate;
      }
      if (this.filters.dateTo) {
        const toDate = new Date(this.filters.dateTo);

        toDate.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && user.DateCreated <= toDate;
      }
      
      return searchMatch && countryMatch && genderMatch && dateMatch;
    });
    
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  }

  toggleSelect(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  isSelected(userId: string): boolean {
    return this.selectedUsers.includes(userId);
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = this.filteredUsers.map(user => user.UserId);
    }
  }

  isAllSelected(): boolean {
    return this.filteredUsers.length > 0 && this.filteredUsers.every(user => this.selectedUsers.includes(user.UserId));
  }

  softDeleteUser(user: User): void {
    this.us.softDeleteSngleUser(user.UserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, true);
          const index = this.users.findIndex(u => u.UserId === user.UserId);
          if (index !== -1) {
            this.users[index].IsDeleted = true;
            this.updateUserGroups();
            this.applyFilters();
          }
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
  }

  restoreUser(user: User): void {
    this.us.restoreSoftDeletedUser(user.UserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, true);
          const index = this.users.findIndex(u => u.UserId === user.UserId);
          if (index !== -1) {
            this.users[index].IsDeleted = false;
            this.updateUserGroups();
            this.applyFilters();
          }
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
  }

  toggleAdminRole(user: User): void {
    this.us.updateUserRole(user.UserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, true);
          const index = this.users.findIndex(u => u.UserId === user.UserId);
          if (index !== -1) {
            this.users[index].Role = this.users[index].Role === 'Admin' ? 'User' : 'Admin';
            this.updateUserGroups();
            this.applyFilters();
          }
          this.fetchUsers();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.userToDelete = null;
    this.showDeleteModal = false;
  }

  permanentlyDeleteUser(): void {
    this.us.deleteSingleUser(this.userToDelete!.UserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, true);
          this.users = this.users.filter(user => user.UserId !== this.userToDelete!.UserId);
          this.updateUserGroups();
          this.applyFilters();
          this.ns.showMessage('User deleted successfully', true);
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    }).add(() => {
      this.cancelDelete();
    });
  }

  softDeleteSelected(): void {
    this.us.softDeleteMultipleUsers(this.selectedUsers).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, true);
          this.users = this.users.map(user => {
            if (this.selectedUsers.includes(user.UserId)) {
              return { ...user, IsDeleted: true };
            }
            return user;
          });
          this.updateUserGroups();
          this.selectedUsers = [];
          this.applyFilters();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  restoreSelected(): void {
    this.us.restoreMultipleDeletedUsers(this.selectedUsers).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, true);
          this.users = this.users.map(user => {
            if (this.selectedUsers.includes(user.UserId)) {
              return { ...user, IsDeleted: false };
            }
            return user;
          });
          this.updateUserGroups();
          this.selectedUsers = [];
          this.applyFilters();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  permanentDeleteSelected(): void {
    this.us.deleteMultipleUsers(this.selectedUsers).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, true);
          this.users = this.users.filter(user => !this.selectedUsers.includes(user.UserId));
          this.updateUserGroups();
          this.selectedUsers = [];
          this.applyFilters();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  canSoftDelete(): boolean {
    return this.selectedUsers.some(userId => {
      const user = this.users.find(u => u.UserId === userId);
      return user && !user.IsDeleted;
    });
  }

  canRestore(): boolean {
    return this.selectedUsers.some(userId => {
      const user = this.users.find(u => u.UserId === userId);
      return user && user.IsDeleted;
    });
  }
}