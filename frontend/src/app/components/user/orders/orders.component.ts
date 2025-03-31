import { Component, OnInit } from '@angular/core';
import { User, Product, Order, CustomOrder, Review } from '../../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { NotificationsService } from '../../../services/notifications.service';
import { OrderService } from '../../../services/order.service';
import { CustomOrderService } from '../../../services/custom-order.service';
import { ReviewsService } from '../../../services/reviews.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];

  customOrders: CustomOrder[] = [];
  
  filteredNormalOrders: Order[] = [];
  filteredCustomOrders: CustomOrder[] = [];

  activeOrderType: 'normal' | 'custom' = 'normal';
  searchTerm: string = '';

  totalOrders: number = 0;
  completedOrders: number = 0;
  inCompleteOrders: number = 0;

  showReviewModal: boolean = false;
  selectedOrderForReview: Order | CustomOrder | null = null;

  newReview: Review = {
    ReviewId: '',
    ProductId: '',
    UserId: '',
    ReviewText: '',
    Rating: 0,
    DateCreated: new Date().toISOString()
  };

  constructor(private ns: NotificationsService, private os: OrderService, private cos: CustomOrderService, private rs: ReviewsService) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.calculateStats();
  }

  fetchOrders(): void {
    this.fetchNormalOrders();
    this.fetchCustomOrders();
    this.filteredNormalOrders = this.orders;
    this.filteredCustomOrders = this.customOrders;
  }

  fetchNormalOrders() {
    this.os.getAllUserOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.orders as Order[];
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.message, false);
      }
    })
  }

  fetchCustomOrders() {
    this.cos.getCustomOrdersByUserId().subscribe({
      next: (response) => {
        if (response.success) {
          this.customOrders = response.customOrders as CustomOrder[];
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.message, false);
      }
    })
  }

  calculateStats(): void {
    this.totalOrders = this.orders.length + this.customOrders.length;
    this.completedOrders = [
      ...this.orders.filter(o => o.DeliveryStatus === 'Delivered'),
      ...this.customOrders.filter(o => o.DeliveryStatus)
    ].length;
    
    this.inCompleteOrders = this.totalOrders - this.completedOrders;
  }

  filterOrders(): void {
    if (this.activeOrderType === 'normal') {
      this.filteredNormalOrders = this.orders.filter(order => 
        this.searchTermMatch(order.Product?.ProductName)
      );
    } else {
      this.filteredCustomOrders = this.customOrders.filter(order => 
        this.searchTermMatch(order.Product?.ProductName)
      );
    }
  }

  searchTermMatch(name?: string): boolean {
    if (!this.searchTerm) return true;
    return name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false;
  }

  openReviewModal(order: Order | CustomOrder): void {
    this.selectedOrderForReview = order;
    this.newReview = {
      ReviewId: '',
      ProductId: order.ProductId,
      UserId: order.UserId,
      ReviewText: '',
      Rating: 0,
      DateCreated: new Date().toISOString()
    };
    this.showReviewModal = true;
  }

  closeReviewModal(event?: Event): void {
    if (event) event.stopPropagation();
    this.showReviewModal = false;
    this.selectedOrderForReview = null;
  }

  submitReview(): void {
    if (this.newReview.ReviewText && this.newReview.Rating > 0) {
      const newReviewEntry: Review = {
        ...this.newReview,
      };

      this.rs.createReview(this.newReview.ProductId, newReviewEntry).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showMessage(response.message as string, true);
          } else {
            this.ns.showMessage(response.error as string, false);
          }
        },
        error: (error) => {
          this.ns.showMessage(error.message, false);
        }
      })
      
      this.calculateStats();
      this.closeReviewModal();
    }
  }
}