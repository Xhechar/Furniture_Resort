import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart, UpdateCartDto } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  API_URL: string = 'http://localhost:3000/cart/'

  constructor(private http: HttpClient) { }

  createCart(ProductId: string, cart: Partial<Cart>): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{success: boolean, error?: string, message?: string}>(`${this.API_URL}create-cart/${ProductId}`, cart, {headers: getAuthHeaders()})
  }

  updateCart(CartId: string, cart: UpdateCartDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-cart/${CartId}`, cart, { headers: getAuthHeaders() })
  }

  updateCartProductQuantity(CartId: string, Quantity: number): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-cart-quantity/${CartId}`, {Quantity}, { headers: getAuthHeaders() })
  }

  updateCartProductOrderType(CartId: string, OrderType: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-cart-order-type/${CartId}`, {OrderType}, { headers: getAuthHeaders() })
  }

  deleteCart(CartId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-cart/${CartId}`, { headers: getAuthHeaders() })
  }

  clearCart(): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}clear-cart`, { headers: getAuthHeaders() })
  }

  getUserCart(): Observable<{ success: boolean, error?: string, message?: string, carts?: Cart[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, carts?: Cart[] }>(`${this.API_URL}get-user-cart`, { headers: getAuthHeaders() })
  }
}
