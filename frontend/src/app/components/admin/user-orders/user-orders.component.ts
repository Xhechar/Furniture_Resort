import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Order, CustomOrder, Progress } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { CustomOrderService } from '../../../services/custom-order.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit {
  // Data storage
  normalOrders: Order[] = [];
  customOrders: CustomOrder[] = [];
  filteredOrders: (Order | CustomOrder)[] = [];
  
  // Stats
  normalOrdersCount = 0;
  customOrdersCount = 0;
  deliveredCount = 0;
  totalRevenue = 0;
  
  // Filters and sorting
  activeTab = 'all';
  searchTerm = '';
  sortField = 'date';
  sortDirection = 'desc';
  statusFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Modal
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType = '';
  modalConfirmText = '';
  selectedOrder: Order | CustomOrder | null = null;
  
  constructor(private os: OrderService, private cos: CustomOrderService, private ns: NotificationsService ) { }
  
  ngOnInit(): void {
    this.fetchOrders();
  }
  
  fetchOrders(): void {

    this.os.getAllOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.normalOrders = response.orders as Order[];
          this.normalOrdersCount = (response.orders as Order[]).length;
          this.calculateStats();
          this.applyFilters();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });

    this.cos.getAllCustomOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.customOrders = response.customOrders as CustomOrder[];
          this.customOrdersCount = (response.customOrders as CustomOrder[]).length;
          this.calculateStats();
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
  
  calculateStats(): void {
    this.deliveredCount = this.normalOrders.filter(order => 
      order.DeliveryStatus == 'delivered').length + 
      this.customOrders.filter(order => order.DeliveryStatus == 'delivered').length;
    
    this.totalRevenue = 
      this.normalOrders.reduce((sum, order) => sum + this.calculateOrderTotal(order), 0) +
      this.customOrders.reduce((sum, order) => sum + this.calculateCustomOrderTotal(order), 0);
  }
  
  calculateOrderTotal(order: Order): number {
    return order.AmountPaid
  }
  
  calculateCustomOrderTotal(order: CustomOrder): number {
    let revenue: number = 0;

    if ((order.Progresses as Progress[])[0].Status === 'complete') {
      revenue = order.Balance + order.Deposit;
    }

    revenue += order.Deposit
    return revenue
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
  }
  
  applyFilters(): void {
    let allOrders: (Order | CustomOrder)[] = [];
    
    if (this.activeTab === 'all') {
      allOrders = [...this.normalOrders, ...this.customOrders];
    } else if (this.activeTab === 'normal') {
      allOrders = [...this.normalOrders];
    } else if (this.activeTab === 'custom') {
      allOrders = [...this.customOrders];
    } else if (this.activeTab === 'delivered') {
      allOrders = [
        ...this.normalOrders.filter(order => order.DeliveryStatus),
        ...this.customOrders.filter(order => order.DeliveryStatus)
      ];
    }
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      allOrders = allOrders.filter(order => {
        const productName = this.getProductName(order).toLowerCase();
        const userName = this.getUserName(order).toLowerCase();
        const userEmail = this.getUserEmail(order).toLowerCase();
        
        return productName.includes(searchLower) || 
               userName.includes(searchLower) || 
               userEmail.includes(searchLower);
      });
    }
    
    // Filter by status
    if (this.statusFilter !== 'all') {
      if (this.statusFilter === 'delivered') {
        allOrders = allOrders.filter(order => this.isDelivered(order));
      } else if (this.statusFilter === 'pending') {
        allOrders = allOrders.filter(order => 
          this.getOrderStatus(order).toLowerCase() === 'pending');
      } else if (this.statusFilter === 'processing') {
        allOrders = allOrders.filter(order => 
          this.getOrderStatus(order).toLowerCase() === 'processing');
      }
    }
    
    // Sort orders
    this.sortOrders(this.sortField, this.sortDirection, allOrders);
    
    // Update pagination
    this.totalPages = Math.ceil(allOrders.length / this.itemsPerPage);
    
    // Paginate
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredOrders = allOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  sortOrders(field: string, direction: string, orders?: (Order | CustomOrder)[]): void {
    this.sortField = field;
    this.sortDirection = direction;
    
    const ordersToSort = orders || this.filteredOrders;
    
    ordersToSort.sort((a, b) => {
      let valueA, valueB;
      
      if (field === 'date') {
        valueA = new Date(this.getOrderDate(a)).getTime();
        valueB = new Date(this.getOrderDate(b)).getTime();
      } else if (field === 'price') {
        valueA = this.isCustomOrder(a) ? 
          this.calculateCustomOrderTotal(a as CustomOrder) : 
          this.calculateOrderTotal(a as Order);
        valueB = this.isCustomOrder(b) ? 
          this.calculateCustomOrderTotal(b as CustomOrder) : 
          this.calculateOrderTotal(b as Order);
      } else {
        valueA = 0;
        valueB = 0;
      }
      
      if (direction === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
    
    if (!orders) {
      this.applyFilters();
    }
  }
  
  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilters();
  }
  
  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }
  
  getPageNumbers(): number[] {
    const pages = [];
    const totalVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + totalVisiblePages - 1);
    
    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  // Utility methods
  isNormalOrder(order: Order | CustomOrder): boolean {
    return !('CustomOrderId' in order);
  }
  
  isCustomOrder(order: Order | CustomOrder): boolean {
    return 'CustomOrderId' in order;
  }
  
  isDelivered(order: Order | CustomOrder): string {
    return order.DeliveryStatus;
  }
  
  getProductImage(order: Order | CustomOrder | null): string {
    if (!order) return '';
    if (!order.Product) return 'assets/images/placeholder.jpg';
    return order.Product.ProductImages.split(', ')[0] || 'assets/images/placeholder.jpg';
  }
  
  getProductName(order: Order | CustomOrder | null): string {
    if (!order) return '';
    if (!order.Product) return 'Unknown Product';
    return order.Product.ProductName || 'Unknown Product';
  }
  
  getOrderQuantity(order: Order | CustomOrder | null): number {
    if (!order) return 0;
    return order.Quantity;
  }
  
  getOrderPrice(order: Order | CustomOrder | null): number {
    if (!order) return 0;
    if (this.isCustomOrder(order)) {
      return this.calculateCustomOrderTotal(order as CustomOrder);
    } else {
      return this.calculateOrderTotal(order as Order);
    }
  }
  
  getOrderDiscount(order: Order | CustomOrder): number {
    return order.Discount;
  }
  
  getOrderDate(order: Order | CustomOrder): string {
    return order.DateCreated;
  }
  
  getOrderStatus(order: Order | CustomOrder): string {
    if (order.DeliveryStatus === 'delivered') return 'Delivered';
    
    if (this.isCustomOrder(order)) {
      const customOrder = order as CustomOrder;
      if (customOrder.Progresses && customOrder.Progresses.length > 0) {
        return 'Processing';
      }
    }
    
    return 'Pending';
  }
  
  getStatusClass(order: Order | CustomOrder): string {
    const status = this.getOrderStatus(order);
    if (status === 'Delivered') return 'status-delivered';
    if (status === 'Processing') return 'status-processing';
    return 'status-pending';
  }
  
  getUserName(order: Order | CustomOrder): string {
    if (!order.User) return 'Unknown User';
    return `${order.User.Fullname.split(' ')[0]} ${order.User.Fullname.split(' ')[1]}` || 'Unknown User';
  }
  
  getUserEmail(order: Order | CustomOrder): string {
    if (!order.User) return 'No email';
    return order.User.Email || 'No email';
  }
  
  // Action methods
  viewOrderDetails(order: Order | CustomOrder): void {
    // You can implement a detailed view or navigate to a details page
    console.log('View order details', order);
  }
  
  updateDeliveryStatus(order: Order | CustomOrder): void {
    this.selectedOrder = order;
    this.modalType = 'delivery';
    this.modalTitle = 'Update Delivery Status';
    this.modalMessage = 'Are you sure you want to mark this order as delivered?';
    this.modalConfirmText = 'Mark as Delivered';
    this.showModal = true;
  }
  
  confirmDelete(order: Order | CustomOrder): void {
    this.selectedOrder = order;
    this.modalType = 'delete';
    this.modalTitle = 'Delete Order';
    this.modalMessage = 'Are you sure you want to delete this order? This action cannot be undone.';
    this.modalConfirmText = 'Delete';
    this.showModal = true;
  }
  
  confirmAction(): void {
    if (!this.selectedOrder) return;
    
    if (this.modalType === 'delivery') {
      this.markAsDelivered(this.selectedOrder);
    } else if (this.modalType === 'delete') {
      this.deleteOrder(this.selectedOrder);
    }
    
    this.cancelAction();
  }
  
  cancelAction(): void {
    this.showModal = false;
    this.selectedOrder = null;
  }
  
  markAsDelivered(order: Order | CustomOrder): void {
    if ('CustomOrderId' in order) {
      this.cos.updateCustomOrderStatus(order.CustomOrderId).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showMessage(response.message as string, response.success);
            this.fetchOrders();
            this.calculateStats();
            this.applyFilters();
          } else {
            this.ns.showMessage(response.error as string, false);
          }
        },
        error: (error) => {
          this.ns.showMessage(error.error.error as string, false);
        }
      });
    } else {
      this.os.updateOrderStatus(order.OrderId).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showMessage(response.message as string, response.success);
            this.fetchOrders();
            this.calculateStats();
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
  }
  
  deleteOrder(order: Order | CustomOrder): void {
    if ('CustomOrderId' in order) {
      this.cos.deleteCustomOrder(order.CustomOrderId).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showMessage(response.message as string, response.success);
            this.fetchOrders();
            this.calculateStats();
            this.applyFilters();
          } else {
            this.ns.showMessage(response.error as string, false);
          }
        },
        error: (error) => {
          this.ns.showMessage(error.error.error as string, false);
        }
      });
    } else {
      this.os.deleteOrder(order.OrderId).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showMessage(response.message as string, response.success);
            this.fetchOrders();
            this.calculateStats();
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
  }
}