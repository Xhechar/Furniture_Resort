import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User, Review, Product } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-myreviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myreviews.component.html',
  styleUrl: './myreviews.component.css'
})
export class MyreviewsComponent implements OnInit {
  // Current logged in user
  currentUser: User | null = null;
  
  // User's reviews with product details
  userReviews: Review[] = [];
  
  // Average rating
  avgRating: number = 0;
  
  // Edit modal state
  isEditModalOpen: boolean = false;
  selectedReview: Review | null = null;
  selectedReviewId: string | null = null;
  
  // Edit form values
  editReviewText: string = '';
  editRating: number = 0;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Instead of API call, we're loading dummy data
    this.loadDummyData();
  }

  loadDummyData(): void {
    // Create dummy current user
    this.currentUser = {
      UserId: "usr123456",
      Fullname: "John Doe",
      Email: "johndoe@example.com",
      Mobile: "+1234567890",
      Country: "United States",
      City: "New York",
      Gender: "Male",
      IdentificationNumber: 123456789,
      ProfileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      BackgroundWallpaper: "",
      Password: "",
      IsWelcomed: true,
      IsDeleted: false,
      DateCreated: new Date("2023-09-10"),
      HasOrder: true,
      HasWishList: true,
      Role: "Customer",
      Selected: false
    };

    // Create dummy product data
    const dummyProducts: Product[] = [
      {
        ProductId: "prod101",
        ProductName: "Premium Leather Jacket",
        ProductImages: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
        ShortDesc: "Handcrafted leather jacket with custom detailing",
        LongDesc: "Made from the finest quality leather, this jacket features custom stitching and premium hardware. Perfect for all seasons.",
        Sizes: "S,M,L,XL",
        Category: "Outerwear",
        Colour: "Brown",
        Prize: 249.99,
        StockQuantity: 15,
        StockLimit: 5,
        CustomPrize: 299.99,
        OnOffer: true,
        OnFlushSale: false,
        Discount: 10,
        MakePeriods: 3,
        Deposit: 50,
        DateCreated: new Date("2023-07-15"),
        IsActivated: true,
        IsCustommable: true
      },
      {
        ProductId: "prod102",
        ProductName: "Canvas Sneakers",
        ProductImages: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
        ShortDesc: "Comfortable everyday sneakers",
        LongDesc: "These lightweight canvas sneakers are perfect for everyday wear. Features cushioned insoles and durable rubber outsoles.",
        Sizes: "7,8,9,10,11",
        Category: "Footwear",
        Colour: "White",
        Prize: 79.99,
        StockQuantity: 30,
        StockLimit: 10,
        CustomPrize: 99.99,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 1,
        Deposit: 0,
        DateCreated: new Date("2023-08-20"),
        IsActivated: true,
        IsCustommable: false
      },
      {
        ProductId: "prod103",
        ProductName: "Handcrafted Wooden Watch",
        ProductImages: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3",
        ShortDesc: "Elegant wooden timepiece",
        LongDesc: "Each watch is handcrafted from sustainable wood and features premium Japanese quartz movement. Water-resistant up to 30m.",
        Sizes: "One Size",
        Category: "Accessories",
        Colour: "Natural Wood",
        Prize: 129.99,
        StockQuantity: 8,
        StockLimit: 3,
        CustomPrize: 159.99,
        OnOffer: true,
        OnFlushSale: false,
        Discount: 15,
        MakePeriods: 2,
        Deposit: 25,
        DateCreated: new Date("2023-09-05"),
        IsActivated: true,
        IsCustommable: true
      }
    ];

    // Create dummy reviews (with different timestamps for testing the edit button visibility)
    const currentTime = new Date();
    const fiftyMinutesAgo = new Date(currentTime.getTime() - 50 * 60 * 1000); // 50 minutes ago
    const twoHoursAgo = new Date(currentTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    const threeDaysAgo = new Date(currentTime.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago

    this.userReviews = [
      {
        ReviewId: "rev101",
        ProductId: "prod101",
        UserId: "usr123456",
        ReviewText: "This leather jacket exceeded my expectations! The quality is outstanding and it fits perfectly. The custom detailing I requested (extra pocket and embossed initials) was executed flawlessly. Definitely worth the price.",
        Rating: 5,
        DateCreated: fiftyMinutesAgo.toISOString(), // Recent enough to edit
        Product: dummyProducts[0],
        User: this.currentUser
      },
      {
        ReviewId: "rev102",
        ProductId: "prod102",
        UserId: "usr123456",
        ReviewText: "Good sneakers for the price. Very comfortable for everyday wear, though I wish there were more color options available. The sizing runs a bit large, so I'd recommend going half a size down.",
        Rating: 4,
        DateCreated: twoHoursAgo.toISOString(), // Too old to edit
        Product: dummyProducts[1],
        User: this.currentUser
      },
      {
        ReviewId: "rev103",
        ProductId: "prod103",
        UserId: "usr123456",
        ReviewText: "Beautiful craftsmanship on this wooden watch! It's lightweight and looks elegant. The only downside is that the band needed some adjustment to fit properly. Overall, I'm very happy with this purchase and get compliments on it regularly.",
        Rating: 4.5,
        DateCreated: threeDaysAgo.toISOString(), // Too old to edit
        Product: dummyProducts[2],
        User: this.currentUser
      }
    ];

    // Calculate average rating from dummy data
    this.calculateAverageRating();
  }

  getCurrentUser(): void {
    // Replace with your actual API endpoint
    this.http.get<User>('/api/users/current').subscribe(
      (user) => {
        this.currentUser = user;
        this.getUserReviews();
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  getUserReviews(): void {
    if (!this.currentUser?.UserId) return;
    
    // Replace with your actual API endpoint
    this.http.get<Review[]>(`/api/users/${this.currentUser.UserId}/reviews`).subscribe(
      (reviews) => {
        this.userReviews = reviews;
        this.calculateAverageRating();
      },
      (error) => {
        console.error('Error fetching user reviews:', error);
      }
    );
  }

  calculateAverageRating(): void {
    if (this.userReviews.length === 0) {
      this.avgRating = 0;
      return;
    }
    
    const sum = this.userReviews.reduce((total, review) => total + review.Rating, 0);
    this.avgRating = sum / this.userReviews.length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Calculate time difference
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Format based on time difference
    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  getLatestReviewDate(): string {
    if (this.userReviews.length === 0) {
      return 'N/A';
    }
    
    // Sort reviews by date (newest first)
    const sortedReviews = [...this.userReviews].sort((a, b) => {
      return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
    });
    
    return this.formatDate(sortedReviews[0].DateCreated);
  }

  canUpdateReview(review: Review): boolean {
    // Check if review is less than 1 hour old
    const reviewDate = new Date(review.DateCreated);
    const now = new Date();
    const diffMs = now.getTime() - reviewDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours < 1;
  }

  toggleEditReview(review: Review): void {
    this.selectedReview = review;
    this.selectedReviewId = review.ReviewId;
    this.editReviewText = review.ReviewText;
    this.editRating = review.Rating;
    this.isEditModalOpen = true;
  }

  closeEditModal(event?: Event): void {
    // Prevent closing when clicking inside the modal content
    if (event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        this.isEditModalOpen = false;
        this.selectedReview = null;
        this.selectedReviewId = null;
      }
    } else {
      this.isEditModalOpen = false;
      this.selectedReview = null;
      this.selectedReviewId = null;
    }
  }

  updateReview(): void {
    if (!this.selectedReview || !this.editReviewText.trim()) return;
    
    const updatedReview = {
      ...this.selectedReview,
      ReviewText: this.editReviewText,
      Rating: this.editRating
    };
    
    // In a real application, you would call an API here
    // For our dummy data, we'll just update it locally
    const index = this.userReviews.findIndex(r => r.ReviewId === this.selectedReview?.ReviewId);
    if (index !== -1) {
      this.userReviews[index] = {
        ...this.userReviews[index],
        ReviewText: this.editReviewText,
        Rating: this.editRating
      };
    }
    
    // Recalculate average rating
    this.calculateAverageRating();
    
    // Close the modal
    this.closeEditModal();
    
    // Highlight the updated review briefly
    this.selectedReviewId = this.selectedReview?.ReviewId || null;
    setTimeout(() => {
      this.selectedReviewId = null;
    }, 2000);
  }

  browseProducts(): void {
    // Navigate to products page
    // Replace with your actual navigation code
    window.location.href = '/products';
  }
}
