import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomOrder, MpesaReferals } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {
  API_URL: string = 'http://localhost:3000/custom-order/'

  constructor(private http: HttpClient) { }

  createCustomOrder(referal: MpesaReferals): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}create-custom-order`, referal, {headers: getAuthHeaders()});
  }

  updateCustomOrder(CustomOrderId: string, referal: MpesaReferals): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-custom-order/${CustomOrderId}`, referal, { headers: getAuthHeaders() });
  }

  deleteCustomOrder(CustomOrderId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-custom-order/${CustomOrderId}`, { headers: getAuthHeaders() });
  }

  getAllCustomOrders(): Observable<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] }>(`${this.API_URL}get-all-custom-orders`, { headers: getAuthHeaders() });
  }

  getCustomOrdersByUserId(): Observable<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] }>(`${this.API_URL}get-custom-orders-by-user`, { headers: getAuthHeaders() });
  }

  getAllCustomOrdersDelivered(): Observable<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] }>(`${this.API_URL}get-all-custom-orders-delivered`, { headers: getAuthHeaders() });
  }
  
  updateCustomOrderStatus(CustomOrderId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-custom-order-status/${CustomOrderId}`, { headers: getAuthHeaders() });
  }
}
