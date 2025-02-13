import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';
import { Wishlist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WishlistsService {
  private API_URL = 'http://localhost:3000/wishlist/';

  constructor(private http: HttpClient) { }

  createWishlist(ProductId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}create-wishlist/${ProductId}`, {}, { headers: getAuthHeaders() });
  }

  deleteWishlist(WishlistId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-wishlist/${WishlistId}`, { headers: getAuthHeaders() });
  }

  getWishlistByUserId(): Observable<{ success: boolean, error?: string, message?: string, wishlists?: Wishlist[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, wishlists?: Wishlist[] }>(`${this.API_URL}get-user-wishlists`, { headers: getAuthHeaders() });
  }
}
