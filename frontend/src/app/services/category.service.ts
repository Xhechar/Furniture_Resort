import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  API_URL: string = 'http://localhost:3000/category/'

  constructor(private http: HttpClient) { }

  createCategory(category: Category): Observable<{ success: boolean, error?: string, message?: string }>{
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}create-category`, category, {headers: getAuthHeaders()});
  }

  updateCategory(CategoryId: string, category: Category): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-category/${CategoryId}`, category, {headers: getAuthHeaders()});
  }

  deleteCategory(CategoryId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-category/${CategoryId}`, {headers: getAuthHeaders()});
  }

  getAllCategories(): Observable<{ success: boolean, error?: string, message?: string, categories?: Category[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, categories?: Category[] }>(`${this.API_URL}get-all-categories`, {headers: getAuthHeaders()});
  } 
}
