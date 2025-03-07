import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Review {
  ReviewId: string;
  ProductId: string;
  UserId: string;
  ReviewText: string;
  Rating: number;
  DateCreated: string;
  Product?: Product;
  User?: User;
  highlighted?: boolean;
}

interface Product {
  ProductId: string;
  ProductName: string;
  ProductImages: string;
  ShortDesc: string;
  LongDesc: string;
  Sizes: string;
  Category: string;
  Colour: string;
  Prize: number;
  StockQuantity: number;
  StockLimit: number;
  CustomPrize: number;
  OnOffer: boolean;
  OnFlushSale: boolean;
  Discount: number;
  MakePeriods: number;
  Deposit: number;
  DateCreated: Date;
  IsActivated: boolean;
  IsCustommable: boolean;
  IsFlushed?: boolean;
  ProductQuantityTimes?: any[];
  Reviews?: Review[];
  Orders?: any[];
  CustomOrders?: any[];
  Carts?: any[];
  Wishlists?: any[];
  Progresses?: any[];
}

interface User {
  UserId: string;
  Fullname: string;
  Email: string;
  Mobile: string;
  Country: string;
  City: string;
  Gender: string;
  IdentificationNumber: number;
  ProfileImage: string;
  BackgroundWallpaper: string;
  Password: string;
  IsWelcomed: boolean;
  IsDeleted: boolean;
  DateCreated: Date;
  HasOrder: boolean;
  HasWishList: boolean;
  Role: string;
  Selected: boolean;
  Orders?: any[];
  CustomOrders?: any[];
  WishListProducts?: any[];
  CartItems?: any[];
  Reviews?: Review[];
  Progresses?: any[];
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('zoomIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AdminReviewsComponent implements OnInit {
  // Data for reviews
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  
  // Filter variables
  searchTerm: string = '';
  filterProduct: string = '';
  filterRating: string = '';
  sortOption: string = 'newest';
  
  // Modal state
  showDeleteModal: boolean = false;
  reviewToDelete: Review | null = null;

  constructor() {}

  ngOnInit(): void {
    // Load mock data
    this.loadMockData();
    // Initialize filtered reviews
    this.filteredReviews = [...this.reviews];
  }

  loadMockData(): void {
    const users: User[] = [
      {
        UserId: 'u1',
        Fullname: 'Sarah Johnson',
        Email: 'sarah.j@example.com',
        ProfileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
        Mobile: '555-123-4567',
        Country: 'United States',
        City: 'New York',
        Gender: 'Female',
        IdentificationNumber: 123456,
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date('2023-03-15'),
        HasOrder: true,
        HasWishList: true,
        Role: 'Customer',
        Selected: false
      },
      {
        UserId: 'u2',
        Fullname: 'Michael Chen',
        Email: 'mchen@example.com',
        ProfileImage: 'https://randomuser.me/api/portraits/men/57.jpg',
        Mobile: '555-987-6543',
        Country: 'Canada',
        City: 'Toronto',
        Gender: 'Male',
        IdentificationNumber: 654321,
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date('2023-05-22'),
        HasOrder: true,
        HasWishList: false,
        Role: 'Customer',
        Selected: false
      },
      {
        UserId: 'u3',
        Fullname: 'Emily Rodriguez',
        Email: 'emily.r@example.com',
        ProfileImage: 'https://randomuser.me/api/portraits/women/23.jpg',
        Mobile: '555-222-3333',
        Country: 'United States',
        City: 'Los Angeles',
        Gender: 'Female',
        IdentificationNumber: 987654,
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date('2023-07-08'),
        HasOrder: true,
        HasWishList: true,
        Role: 'Customer',
        Selected: false
      },
      {
        UserId: 'u4',
        Fullname: 'David Wilson',
        Email: 'd.wilson@example.com',
        ProfileImage: 'https://randomuser.me/api/portraits/men/42.jpg',
        Mobile: '555-444-5555',
        Country: 'United Kingdom',
        City: 'London',
        Gender: 'Male',
        IdentificationNumber: 456789,
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date('2023-04-19'),
        HasOrder: false,
        HasWishList: true,
        Role: 'Customer',
        Selected: false
      }
    ];

    const products: Product[] = [
      {
        ProductId: 'p1',
        ProductName: 'Premium Leather Wallet',
        ProductImages: 'wallet.jpg',
        ShortDesc: 'Handcrafted genuine leather wallet',
        LongDesc: 'This premium wallet is handcrafted from genuine full-grain leather, featuring multiple card slots and a coin pocket.',
        Sizes: 'One Size',
        Category: 'Accessories',
        Colour: 'Brown',
        Prize: 49.99,
        StockQuantity: 100,
        StockLimit: 10,
        CustomPrize: 59.99,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date('2023-01-15'),
        IsActivated: true,
        IsCustommable: true
      },
      {
        ProductId: 'p2',
        ProductName: 'Wireless Earbuds Pro',
        ProductImages: 'earbuds.jpg',
        ShortDesc: 'High-quality noise-cancelling earbuds',
        LongDesc: 'These wireless earbuds feature active noise cancellation, water resistance, and 8 hours of battery life.',
        Sizes: 'One Size',
        Category: 'Electronics',
        Colour: 'Black',
        Prize: 129.99,
        StockQuantity: 75,
        StockLimit: 5,
        CustomPrize: 0,
        OnOffer: true,
        OnFlushSale: false,
        Discount: 15,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date('2023-02-10'),
        IsActivated: true,
        IsCustommable: false
      },
      {
        ProductId: 'p3',
        ProductName: 'Organic Cotton T-Shirt',
        ProductImages: 'tshirt.jpg',
        ShortDesc: 'Eco-friendly 100% organic cotton t-shirt',
        LongDesc: 'This comfortable t-shirt is made from 100% organic cotton, ethically sourced and environmentally friendly.',
        Sizes: 'S,M,L,XL',
        Category: 'Clothing',
        Colour: 'White',
        Prize: 24.99,
        StockQuantity: 200,
        StockLimit: 20,
        CustomPrize: 34.99,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date('2023-03-05'),
        IsActivated: true,
        IsCustommable: true
      },
      {
        ProductId: 'p4',
        ProductName: 'Smart Home Security Camera',
        ProductImages: 'camera.jpg',
        ShortDesc: 'HD security camera with motion detection',
        LongDesc: 'This smart security camera offers 1080p HD video, night vision, motion detection alerts, and cloud storage options.',
        Sizes: 'One Size',
        Category: 'Electronics',
        Colour: 'White',
        Prize: 79.99,
        StockQuantity: 50,
        StockLimit: 5,
        CustomPrize: 0,
        OnOffer: true,
        OnFlushSale: false,
        Discount: 10,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date('2023-02-25'),
        IsActivated: true,
        IsCustommable: false
      }
    ];

    // Create reviews with product and user references
    this.reviews = [
      {
        ReviewId: 'r1',
        ProductId: 'p1',
        UserId: 'u1',
        ReviewText: 'The quality of this leather wallet is exceptional. I love the craftsmanship and attention to detail. The leather is soft yet durable, and it has plenty of card slots for my needs. Highly recommend!',
        Rating: 5,
        DateCreated: '2024-02-10T14:32:00',
        Product: products.find(p => p.ProductId === 'p1'),
        User: users.find(u => u.UserId === 'u1'),
        highlighted: true
      },
      {
        ReviewId: 'r2',
        ProductId: 'p2',
        UserId: 'u2',
        ReviewText: 'These earbuds have amazing sound quality and the noise cancellation works really well. Battery life is good but not great. The fit is comfortable for long periods of use.',
        Rating: 4,
        DateCreated: '2024-02-15T09:45:00',
        Product: products.find(p => p.ProductId === 'p2'),
        User: users.find(u => u.UserId === 'u2'),
        highlighted: false
      },
      {
        ReviewId: 'r3',
        ProductId: 'p3',
        UserId: 'u3',
        ReviewText: 'This t-shirt is so comfortable! The organic cotton feels great against the skin and the fit is perfect. I appreciate the eco-friendly approach and will definitely buy more in different colors.',
        Rating: 5,
        DateCreated: '2024-02-20T16:22:00',
        Product: products.find(p => p.ProductId === 'p3'),
        User: users.find(u => u.UserId === 'u3'),
        highlighted: false
      },
      {
        ReviewId: 'r4',
        ProductId: 'p4',
        UserId: 'u4',
        ReviewText: 'The camera has good video quality but the app is a bit glitchy. Setup was easier than expected though, and the motion detection works well for my needs.',
        Rating: 3,
        DateCreated: '2024-02-25T11:17:00',
        Product: products.find(p => p.ProductId === 'p4'),
        User: users.find(u => u.UserId === 'u4'),
        highlighted: false
      },
      {
        ReviewId: 'r5',
        ProductId: 'p1',
        UserId: 'u2',
        ReviewText: 'Decent wallet but the stitching started coming loose after just a few weeks of use. The leather quality is good though. I expected better durability for the price.',
        Rating: 2,
        DateCreated: '2024-03-01T13:40:00',
        Product: products.find(p => p.ProductId === 'p1'),
        User: users.find(u => u.UserId === 'u2'),
        highlighted: false
      },
      {
        ReviewId: 'r6',
        ProductId: 'p2',
        UserId: 'u3',
        ReviewText: 'Love these earbuds! The sound quality is outstanding and they pair quickly with all my devices. The noise cancellation is a game-changer for my commute. Worth every penny!',
        Rating: 5,
        DateCreated: '2024-03-02T08:30:00',
        Product: products.find(p => p.ProductId === 'p2'),
        User: users.find(u => u.UserId === 'u3'),
        highlighted: true
      },
      {
        ReviewId: 'r7',
        ProductId: 'p3',
        UserId: 'u1',
        ReviewText: "The t-shirt fits well but the fabric is thinner than I expected. It's comfortable but I'm not sure how well it will hold up in the wash. Nice color though!",
        Rating: 3,
        DateCreated: '2024-03-03T14:52:00',
        Product: products.find(p => p.ProductId === 'p3'),
        User: users.find(u => u.UserId === 'u1'),
        highlighted: false
      },
      {
        ReviewId: 'r8',
        ProductId: 'p4',
        UserId: 'u2',
        ReviewText: "Excellent security camera! The picture quality is crystal clear, and the night vision works perfectly. The mobile app is intuitive and full of useful features. I've already recommended it to friends.",
        Rating: 5,
        DateCreated: '2024-03-04T19:15:00',
        Product: products.find(p => p.ProductId === 'p4'),
        User: users.find(u => u.UserId === 'u2'),
        highlighted: false
      },
      {
        ReviewId: 'r9',
        ProductId: 'p1',
        UserId: 'u3',
        ReviewText: "I've had this wallet for a month now and I'm impressed with how well it's holding up. The leather has developed a nice patina and the card slots have loosened up just enough. Great purchase!",
        Rating: 4,
        DateCreated: '2024-03-05T10:08:00',
        Product: products.find(p => p.ProductId === 'p1'),
        User: users.find(u => u.UserId === 'u3'),
        highlighted: false
      },
      {
        ReviewId: 'r10',
        ProductId: 'p2',
        UserId: 'u1',
        ReviewText: 'Disappointed with these earbuds. They keep disconnecting during calls and the battery drains faster than advertised. The sound quality is okay but not worth the hassle.',
        Rating: 2,
        DateCreated: '2024-03-06T15:22:00',
        Product: products.find(p => p.ProductId === 'p2'),
        User: users.find(u => u.UserId === 'u1'),
        highlighted: false
      }
    ];
  }

  // Filter and sort reviews
  applyFilters(): void {
    let filtered = [...this.reviews];
    
    // Apply search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.ReviewText.toLowerCase().includes(searchLower) ||
        review.Product?.ProductName.toLowerCase().includes(searchLower) ||
        review.User?.Fullname.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply product filter
    if (this.filterProduct) {
      filtered = filtered.filter(review => review.ProductId === this.filterProduct);
    }
    
    // Apply rating filter
    if (this.filterRating) {
      filtered = filtered.filter(review => review.Rating === parseInt(this.filterRating));
    }
    
    // Apply sorting
    filtered = this.sortReviews(filtered);
    
    this.filteredReviews = filtered;
  }
  
  // Sort reviews based on selected option
  sortReviews(reviews: Review[]): Review[] {
    switch (this.sortOption) {
      case 'newest':
        return reviews.sort((a, b) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime());
      case 'oldest':
        return reviews.sort((a, b) => new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime());
      case 'highest':
        return reviews.sort((a, b) => b.Rating - a.Rating);
      case 'lowest':
        return reviews.sort((a, b) => a.Rating - b.Rating);
      default:
        return reviews;
    }
  }
  
  // Reset all filters
  resetFilters(): void {
    this.searchTerm = '';
    this.filterProduct = '';
    this.filterRating = '';
    this.sortOption = 'newest';
    this.applyFilters();
  }
  
  // Get unique products for the filter dropdown
  getUniqueProducts(): Product[] {
    const uniqueProductIds = [...new Set(this.reviews.map(review => review.ProductId))];
    return uniqueProductIds
      .map(id => this.reviews.find(review => review.ProductId === id)?.Product)
      .filter((product): product is Product => product !== undefined);
  }
  
  // Calculate average rating
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((total, review) => total + review.Rating, 0);
    return sum / this.reviews.length;
  }
  
  // Calculate percentage of positive reviews (4-5 stars)
  getPositiveReviewsPercentage(): number {
    if (this.reviews.length === 0) return 0;
    const positiveCount = this.reviews.filter(review => review.Rating >= 4).length;
    return Math.round((positiveCount / this.reviews.length) * 100);
  }
  
  // Count reviews from the past week
  getRecentReviewsCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.reviews.filter(review => {
      const reviewDate = new Date(review.DateCreated);
      return reviewDate >= oneWeekAgo;
    }).length;
  }
  
  // Count reviews for each rating (1-5)
  getRatingCount(rating: number): number {
    return this.reviews.filter(review => review.Rating === rating).length;
  }
  
  // Calculate percentage for each rating
  getRatingPercentage(rating: number): number {
    if (this.reviews.length === 0) return 0;
    const count = this.getRatingCount(rating);
    return Math.round((count / this.reviews.length) * 100);
  }
  
  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Check if a review is new (less than 7 days old)
  isNewReview(review: Review): boolean {
    const reviewDate = new Date(review.DateCreated);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return reviewDate >= oneWeekAgo;
  }
  
  // Check if a user has multiple reviews
  hasMultipleReviews(userId: string): boolean {
    return this.reviews.filter(review => review.UserId === userId).length > 1;
  }
  
  // Highlight search terms in review text
  highlightSearchTerm(text: string): string {
    if (!this.searchTerm || this.searchTerm.trim() === '') return text;
    
    const searchLower = this.searchTerm.toLowerCase();
    const textLower = text.toLowerCase();
    const indices: [number, number][] = [];
    
    let startIndex = 0;
    while (startIndex < textLower.length) {
      const index = textLower.indexOf(searchLower, startIndex);
      if (index === -1) break;
      
      indices.push([index, index + searchLower.length]);
      startIndex = index + 1;
    }
    
    if (indices.length === 0) return text;
    
    let result = '';
    let lastIndex = 0;
    
    for (const [start, end] of indices) {
      result += text.substring(lastIndex, start);
      result += `<span class="highlight">${text.substring(start, end)}</span>`;
      lastIndex = end;
    }
    
    result += text.substring(lastIndex);
    return result;
  }
  
  // Toggle highlight status for a review
  toggleHighlight(review: Review): void {
    review.highlighted = !review.highlighted;
    // In a real application, you would save this change to the backend
  }
  
  // Edit review (this would be expanded in a real application)
  editReview(review: Review): void {
    // This would open an edit form or dialog in a real application
    console.log('Editing review:', review);
  }
  
  // Prepare to delete a review
  confirmDeleteReview(review: Review): void {
    this.reviewToDelete = review;
    this.showDeleteModal = true;
  }
  
  // Cancel delete operation
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.reviewToDelete = null;
  }
  
  // Delete a review
  deleteReview(): void {
    if (this.reviewToDelete) {
      // Remove from both arrays
      this.reviews = this.reviews.filter(r => r.ReviewId !== this.reviewToDelete?.ReviewId);
      this.filteredReviews = this.filteredReviews.filter(r => r.ReviewId !== this.reviewToDelete?.ReviewId);
      
      // Reset delete state
      this.showDeleteModal = false;
      this.reviewToDelete = null;
      
      // In a real application, you would make an API call to delete from the backend
    }
  }
}