import { Component, OnInit } from '@angular/core';
import { Review } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../../services/reviews.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myreviews',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './myreviews.component.html',
  styleUrl: './myreviews.component.css'
})
export class MyreviewsComponent implements OnInit {
  userReviews: Review[] = [];

  avgRating: number = 0;

  isEditModalOpen: boolean = false;
  selectedReview: Review | null = null;
  selectedReviewId: string | null = null;

  editReviewText: string = '';
  editRating: number = 0;
  
  constructor(private rs: ReviewsService, private ns: NotificationsService, private router: Router) { }

  ngOnInit(): void {
    this.getUserReviews();
  }

  getUserReviews(): void {
    this.rs.getReviewsByUserId().subscribe({
      next: (response) => {
        if (response.success) {
          this.userReviews = response.reviews;
          this.calculateAverageRating();
        } else {
          // this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
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

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

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

    const sortedReviews = [...this.userReviews].sort((a, b) => {
      return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
    });
    
    return this.formatDate(sortedReviews[0].DateCreated);
  }

  canUpdateReview(review: Review): boolean {
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
    
    this.rs.updateReview(updatedReview.ReviewId, updatedReview).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, response.success);
          this.calculateAverageRating();
          this.getUserReviews();
          this.closeEditModal();
    
          this.selectedReviewId = this.selectedReview?.ReviewId || null;
          setTimeout(() => {
            this.selectedReviewId = null;
          }, 2000);
        } else {
          this.ns.showMessage(response.error as string, false);
          this.closeEditModal();
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
        this.closeEditModal();
      }
    });
  }

  browseProducts() {
    this.router.navigate(['user']);
  }
}
