import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/interfaces';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private API_URL = 'http://localhost:3000/order/';

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}create-order`, order, { headers: getAuthHeaders() });
  }

  updateOrderStatus(OrderId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-order-status/${OrderId}`, { headers: getAuthHeaders() });
  }

  deleteOrder(OrderId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-order/${OrderId}`, { headers: getAuthHeaders() });
  }

  getAllOrders(): Observable<{ success: boolean; orders?: Order[]; error?: string; message?: string }> {
    return this.http.get<{ success: boolean; orders?: Order[]; error?: string; message?: string }>(
      `${this.API_URL}get-all-orders`,
      { headers: getAuthHeaders() }
    );
  }

  getAllOrdersDelivered(): Observable<{ success: boolean; orders?: Order[]; error?: string; message?: string }> {
    return this.http.get<{ success: boolean; orders?: Order[]; error?: string; message?: string }>(
      `${this.API_URL}get-all-orders-delivered`,
      { headers: getAuthHeaders() }
    );
  }

  getAllUserOrders(): Observable<{ success: boolean; orders?: Order[]; error?: string; message?: string }> {
    return this.http.get<{ success: boolean; orders?: Order[]; error?: string; message?: string }>(
      `${this.API_URL}get-all-user-orders`,
      { headers: getAuthHeaders() }
    );
  }
}
