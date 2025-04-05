import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  // User data
  users: User[] = [];
  filteredUsers: User[] = [];
  activeUsers: User[] = [];
  deletedUsers: User[] = [];
  adminUsers: User[] = [];
  
  // Selected users for bulk actions
  selectedUsers: string[] = [];
  
  // Active section
  activeSection: 'all' | 'active' | 'deleted' | 'admin' = 'all';
  
  // Search and filters
  searchTerm: string = '';
  filters = {
    country: '',
    gender: '',
    dateFrom: '',
    dateTo: ''
  };
  
  // Unique filter options
  uniqueCountries: string[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Delete confirmation
  showDeleteModal: boolean = false;
  userToDelete: User | null = null;

  constructor() { }

  ngOnInit(): void {
    // Fetch users data - replace with actual API call
    this.fetchUsers();
    
    // Initialize filter options
    this.initializeFilterOptions();
    
    // Set initial filtered users
    this.applyFilters();
  }

  fetchUsers(): void {
    // Mock data - replace with actual API call
    this.users = [
      // Add sample users for demonstration
      {
        UserId: '1234567890abcdef',
        Fullname: 'John Doe',
        Email: 'john.doe@example.com',
        Mobile: '+1 234 567 8901',
        Country: 'United States',
        City: 'New York',
        Gender: 'Male',
        IdentificationNumber: 123456789,
        ProfileImage: 'assets/images/profile1.jpg',
        BackgroundWallpaper: '',
        Password: '', // Don't expose actual passwords
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date('2023-01-15'),
        HasOrder: true,
        HasWishList: true,
        Role: 'User',
        Selected: false,
        Orders: [{ OrderId: 'ord1', UserId: '1234567890abcdef', ProductId: 'prod1', Quantity: 1, Price: 100, AmountPaid: 100, OrderType: 'Normal', Discount: 0, DateCreated: '2023-02-01', DeliveryStatus: 'Delivered' }],
        WishListProducts: [{ WishlistId: 'wish1', ProductId: 'prod2', UserId: '1234567890abcdef', DateCreated: '2023-01-20' }],
        Reviews: [{ ReviewId: 'rev1', ProductId: 'prod1', UserId: '1234567890abcdef', ReviewText: 'Great product!', Rating: 5, DateCreated: '2023-02-10' }]
      },
      {
        UserId: '0987654321fedcba',
        Fullname: 'Jane Smith',
        Email: 'jane.smith@example.com',
        Mobile: '+1 987 654 3210',
        Country: 'United Kingdom',
        City: 'London',
        Gender: 'Female',
        IdentificationNumber: 987654321,
        ProfileImage: 'assets/images/profile2.jpg',
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date('2023-02-20'),
        HasOrder: false,
        HasWishList: true,
        Role: 'Admin',
        Selected: false,
        WishListProducts: [{ WishlistId: 'wish2', ProductId: 'prod3', UserId: '0987654321fedcba', DateCreated: '2023-02-25' }]
      },
      {
        UserId: 'abcdef1234567890',
        Fullname: 'Alex Johnson',
        Email: 'alex.johnson@example.com',
        Mobile: '+44 1234 567890',
        Country: 'Canada',
        City: 'Toronto',
        Gender: 'Male',
        IdentificationNumber: 456789123,
        ProfileImage: 'assets/images/profile3.jpg',
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: true,
        DateCreated: new Date('2022-11-05'),
        HasOrder: true,
        HasWishList: false,
        Role: 'User',
        Selected: false,
        Orders: [{ OrderId: 'ord2', UserId: 'abcdef1234567890', ProductId: 'prod4', Quantity: 2, Price: 150, AmountPaid: 150, OrderType: 'Normal', Discount: 0, DateCreated: '2022-12-10', DeliveryStatus: 'Delivered' }]
      }
    ];
    
    // Initialize user groups
    this.updateUserGroups();
  }

  initializeFilterOptions(): void {
    // Extract unique countries
    this.uniqueCountries = [...new Set(this.users.map(user => user.Country))];
  }

  updateUserGroups(): void {
    // Update user groups based on their properties
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
    
    // Then apply search and other filters
    this.filteredUsers = sectionFiltered.filter(user => {
      // Search term filter
      const searchMatch = this.searchTerm === '' || 
        user.Fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.UserId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Country filter
      const countryMatch = this.filters.country === '' || user.Country === this.filters.country;
      
      // Gender filter
      const genderMatch = this.filters.gender === '' || user.Gender === this.filters.gender;
      
      // Date range filter
      let dateMatch = true;
      if (this.filters.dateFrom) {
        const fromDate = new Date(this.filters.dateFrom);
        dateMatch = dateMatch && user.DateCreated >= fromDate;
      }
      if (this.filters.dateTo) {
        const toDate = new Date(this.filters.dateTo);
        // Set time to end of day
        toDate.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && user.DateCreated <= toDate;
      }
      
      return searchMatch && countryMatch && genderMatch && dateMatch;
    });
    
    // Update pagination
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  // Pagination methods
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
    
    // Adjust start if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  }

  // Selection methods
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
    return this.filteredUsers.length > 0 && 
           this.filteredUsers.every(user => this.selectedUsers.includes(user.UserId));
  }

  // User action methods
  softDeleteUser(user: User): void {
    const index = this.users.findIndex(u => u.UserId === user.UserId);
    if (index !== -1) {
      this.users[index].IsDeleted = true;
      this.updateUserGroups();
      this.applyFilters();
    }
  }

  restoreUser(user: User): void {
    const index = this.users.findIndex(u => u.UserId === user.UserId);
    if (index !== -1) {
      this.users[index].IsDeleted = false;
      this.updateUserGroups();
      this.applyFilters();
    }
  }

  toggleAdminRole(user: User): void {
    const index = this.users.findIndex(u => u.UserId === user.UserId);
    if (index !== -1) {
      this.users[index].Role = this.users[index].Role === 'Admin' ? 'User' : 'Admin';
      this.updateUserGroups();
      this.applyFilters();
    }
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
    if (this.userToDelete) {
      const index = this.users.findIndex(u => u.UserId === this.userToDelete?.UserId);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.updateUserGroups();
        this.applyFilters();
        this.showDeleteModal = false;
        this.userToDelete = null;
      }
    }
  }

  // Bulk action methods
  softDeleteSelected(): void {
    this.users = this.users.map(user => {
      if (this.selectedUsers.includes(user.UserId)) {
        return { ...user, IsDeleted: true };
      }
      return user;
    });
    this.updateUserGroups();
    this.selectedUsers = [];
    this.applyFilters();
  }

  restoreSelected(): void {
    this.users = this.users.map(user => {
      if (this.selectedUsers.includes(user.UserId)) {
        return { ...user, IsDeleted: false };
      }
      return user;
    });
    this.updateUserGroups();
    this.selectedUsers = [];
    this.applyFilters();
  }

  permanentDeleteSelected(): void {
    this.users = this.users.filter(user => !this.selectedUsers.includes(user.UserId));
    this.updateUserGroups();
    this.selectedUsers = [];
    this.applyFilters();
  }

  // Helper methods
  formatDate(date: Date): string {
    if (!date) return 'N/A';
    
    // Convert string to Date if needed
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