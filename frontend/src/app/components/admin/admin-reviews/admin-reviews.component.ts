import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, Review, User } from '../../../interfaces/interfaces';
import { ReviewsService } from '../../../services/reviews.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationsComponent } from "../../notifications/notifications.component";

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
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
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  
  searchTerm: string = '';
  filterProduct: string = '';
  filterRating: string = '';
  sortOption: string = 'newest';
  
  showDeleteModal: boolean = false;
  reviewToDelete: Review | null = null;

  constructor(private rs: ReviewsService, private ns: NotificationsService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.rs.getAllReviews().subscribe({
      next: (response) => {
        if (response.success) {
          this.reviews = response.reviews as Review[];
          this.filteredReviews = [...this.reviews];
        } else {
          // this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  applyFilters(): void {
    let filtered = [...this.reviews];
    
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
  
  resetFilters(): void {
    this.searchTerm = '';
    this.filterProduct = '';
    this.filterRating = '';
    this.sortOption = 'newest';
    this.applyFilters();
  }
  
  getUniqueProducts(): Product[] {
    const uniqueProductIds = [...new Set(this.reviews.map(review => review.ProductId))];
    return uniqueProductIds
      .map(id => this.reviews.find(review => review.ProductId === id)?.Product)
      .filter((product): product is Product => product !== undefined);
  }
  
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((total, review) => total + review.Rating, 0);
    return sum / this.reviews.length;
  }
  
  getPositiveReviewsPercentage(): number {
    if (this.reviews.length === 0) return 0;
    const positiveCount = this.reviews.filter(review => review.Rating >= 4).length;
    return Math.round((positiveCount / this.reviews.length) * 100);
  }
  
  getRecentReviewsCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.reviews.filter(review => {
      const reviewDate = new Date(review.DateCreated);
      return reviewDate >= oneWeekAgo;
    }).length;
  }
  
  getRatingCount(rating: number): number {
    return this.reviews.filter(review => review.Rating === rating).length;
  }
  
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
  
  toggleHighlight(review: Review): void {
    // review.highlighted = !review.highlighted;
  }
  
  // Edit review (this would be expanded in a real application)
  editReview(review: Review): void {
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