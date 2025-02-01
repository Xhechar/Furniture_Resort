import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductQuantityTime } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class PqtService {
  
  API_URL: string = 'http://localhost:3000/pqt/'

  constructor(private http: HttpClient) { }

  createPQT(pqt: ProductQuantityTime): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}create`, pqt, {headers: getAuthHeaders()});
  }

  updatePQT(ProductQuantityTimeId: string, pqt: ProductQuantityTime): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-pqt/${ProductQuantityTimeId}`, pqt, {headers: getAuthHeaders()});
  }

  deletePQT(ProductQuantityTimeId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-pqt/${ProductQuantityTimeId}`, {headers: getAuthHeaders()});
  }

  getPQTByProductId(ProductId: string): Observable<{ success: boolean, error?: string, message?: string, pqts?: ProductQuantityTime[] | unknown[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, pqts?: ProductQuantityTime[] | unknown[] }>(`${this.API_URL}get-pqts-by-product/${ProductId}`);
  }
}
