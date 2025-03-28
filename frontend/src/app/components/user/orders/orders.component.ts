import { Component, OnInit } from '@angular/core';
import { User, Product, Order, CustomOrder, Review } from '../../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../../notifications/notifications.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  // Dummy User
  currentUser: User = {
    UserId: 'user_001',
    Fullname: 'John Doe',
    Email: 'john.doe@example.com',
    Mobile: '+1234567890',
    Country: 'United States',
    City: 'New York',
    Gender: 'Male',
    IdentificationNumber: 12345,
    ProfileImage: 'https://example.com/profile.jpg',
    BackgroundWallpaper: 'https://example.com/wallpaper.jpg',
    Password: '', // Securely handled
    IsWelcomed: true,
    IsDeleted: false,
    DateCreated: new Date(),
    HasOrder: true,
    HasWishList: true,
    Role: 'Customer',
    Selected: false
  };

  // Dummy Products
  products: Product[] = [
    {
      ProductId: 'prod_001',
      ProductName: 'Vintage Leather Jacket',
      ProductImages: 'https://example.com/jacket1.jpg,https://example.com/jacket2.jpg',
      ShortDesc: 'Classic leather jacket with modern twist',
      LongDesc: 'Handcrafted leather jacket made from premium quality leather. Perfect for any occasion.',
      Sizes: 'S,M,L,XL',
      Category: 'Outerwear',
      Colour: 'Brown',
      Prize: 299.99,
      StockQuantity: 50,
      StockLimit: 100,
      CustomPrize: 0,
      OnOffer: true,
      OnFlushSale: false,
      Discount: 10,
      MakePeriods: 30,
      Deposit: 50,
      DateCreated: new Date(),
      IsActivated: true,
      IsCustommable: false
    },
    {
      ProductId: 'prod_002',
      ProductName: 'Custom Tailored Suit',
      ProductImages: 'https://example.com/suit1.jpg,https://example.com/suit2.jpg',
      ShortDesc: 'Bespoke suit tailored to your measurements',
      LongDesc: 'Completely customizable suit made with premium fabrics and precise measurements.',
      Sizes: 'Custom',
      Category: 'Formal Wear',
      Colour: 'Navy Blue',
      Prize: 599.99,
      StockQuantity: 20,
      StockLimit: 50,
      CustomPrize: 799.99,
      OnOffer: false,
      OnFlushSale: false,
      Discount: 0,
      MakePeriods: 60,
      Deposit: 200,
      DateCreated: new Date(),
      IsActivated: true,
      IsCustommable: true
    },
    {
      ProductId: 'prod_003',
      ProductName: 'Vintage Leather Boots',
      ProductImages: 'https://example.com/boots1.jpg,https://example.com/boots2.jpg',
      ShortDesc: 'Handcrafted leather boots',
      LongDesc: 'Durable leather boots with classic design and comfortable fit.',
      Sizes: '7,8,9,10,11,12',
      Category: 'Footwear',
      Colour: 'Dark Brown',
      Prize: 249.99,
      StockQuantity: 75,
      StockLimit: 100,
      CustomPrize: 0,
      OnOffer: false,
      OnFlushSale: true,
      Discount: 15,
      MakePeriods: 0,
      Deposit: 0,
      DateCreated: new Date(),
      IsActivated: true,
      IsCustommable: false
    }
  ];

  // Dummy Normal Orders
  orders: Order[] = [
    {
      OrderId: 'order_001',
      UserId: 'user_001',
      ProductId: 'prod_001',
      Quantity: 1,
      Price: 299.99,
      AmountPaid: 269.99,
      OrderType: 'Online',
      Discount: 10,
      DateCreated: new Date('2024-01-15').toISOString(),
      DeliveryStatus: 'Delivered',
      Product: this.products[0],
      User: this.currentUser
    },
    {
      OrderId: 'order_002',
      UserId: 'user_001',
      ProductId: 'prod_003',
      Quantity: 1,
      Price: 249.99,
      AmountPaid: 212.49,
      OrderType: 'Online',
      Discount: 15,
      DateCreated: new Date('2024-02-20').toISOString(),
      DeliveryStatus: 'In Transit',
      Product: this.products[2],
      User: this.currentUser
    }
  ];

  // Dummy Custom Orders
  customOrders: CustomOrder[] = [
    {
      CustomOrderId: 'custom_001',
      ProductId: 'prod_002',
      UserId: 'user_001',
      Price: 799.99,
      Discount: 0,
      Quantity: 1,
      Deposit: 200,
      Balance: 599.99,
      DateCreated: new Date('2024-03-10').toISOString(),
      DateModified: new Date(),
      DeliveryStatus: false,
      Product: this.products[1],
      User: this.currentUser
    }
  ];

  // Dummy Reviews
  reviews: Review[] = [
    {
      ReviewId: 'review_001',
      ProductId: 'prod_001',
      UserId: 'user_001',
      ReviewText: 'Fantastic leather jacket! Great quality and fits perfectly.',
      Rating: 5,
      DateCreated: new Date('2024-01-25').toISOString(),
      Product: this.products[0],
      User: this.currentUser
    }
  ];
  
  // Rest of the component remains the same as in the previous implementation
  filteredNormalOrders: Order[] = [];
  filteredCustomOrders: CustomOrder[] = [];

  activeOrderType: 'normal' | 'custom' = 'normal';
  searchTerm: string = '';

  totalOrders: number = 0;
  completedOrders: number = 0;
  reviewsCount: number = 0;

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

  constructor() {}

  ngOnInit(): void {
    this.fetchOrders();
    this.calculateStats();
  }

  fetchOrders(): void {
    this.filteredNormalOrders = this.orders;
    this.filteredCustomOrders = this.customOrders;
  }

  calculateStats(): void {
    this.totalOrders = this.orders.length + this.customOrders.length;
    this.completedOrders = [
      ...this.orders.filter(o => o.DeliveryStatus === 'Delivered'),
      ...this.customOrders.filter(o => o.DeliveryStatus)
    ].length;
    
    this.reviewsCount = this.reviews.length;
  }

  // Rest of the methods remain the same as in the previous implementation
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
        ReviewId: `review_${this.reviews.length + 1}`,
        Product: this.selectedOrderForReview?.Product,
        User: this.currentUser
      };

      this.reviews.push(newReviewEntry);
      this.calculateStats();
      this.closeReviewModal();
    }
  }
}