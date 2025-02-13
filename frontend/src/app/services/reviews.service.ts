import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private API_URL = 'http://localhost:3000/reviews/';

  constructor(private http: HttpClient) { }

  createReview(review: Review): Observable<{ success: boolean; error?: string; message?: string }> {
    return this.http.post<{ success: boolean; error?: string; message?: string }>(
      `${this.API_URL}create-review`,
      review,
      { headers: getAuthHeaders() }
    );
  }

  updateReview(ReviewId: string, review: Partial<Review>): Observable<{ success: boolean; error?: string; message?: string }> {
    return this.http.put<{ success: boolean; error?: string; message?: string }>(
      `${this.API_URL}update-review/${ReviewId}`,
      review,
      { headers: getAuthHeaders() }
    );
  }

  deleteReview(ReviewId: string): Observable<{ success: boolean; error?: string; message?: string }> {
    return this.http.delete<{ success: boolean; error?: string; message?: string }>(
      `${this.API_URL}delete-review/${ReviewId}`,
      { headers: getAuthHeaders() }
    );
  }

  getAllReviews(): Observable<{ success: boolean; error?: string; message?: string; reviews: Review[] }> {
    return this.http.get<{ success: boolean; error?: string; message?: string; reviews: Review[] }>(
      `${this.API_URL}get-all-reviews`,
      { headers: getAuthHeaders() }
    );
  }

  getReviewsByUserId(): Observable<{ success: boolean; error?: string; message?: string; reviews: Review[] }> {
    return this.http.get<{ success: boolean; error?: string; message?: string; reviews: Review[] }>(
      `${this.API_URL}get-reviews-by-user/`,
      { headers: getAuthHeaders() }
    );
  }
}
