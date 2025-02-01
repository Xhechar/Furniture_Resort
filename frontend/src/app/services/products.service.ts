import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  API_URL: string = 'http://localhost:3000/products/'

  constructor(private http: HttpClient) { }

  createProduct(product: Product): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}create-product`, product, {headers: getAuthHeaders()});
  }

  updateProduct(ProductId: string, product: Partial<Product>): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}update-product/${ProductId}`, product, {headers: getAuthHeaders()});
  }

  toggleActivationStatus(ProductId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-activation-status/${ProductId}`, {}, {headers: getAuthHeaders()});
  }

  toggleActivationOfMultipleProducts(ProductIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-activation-of-multiple-products`, {ProductIds}, {headers: getAuthHeaders()});
  }

  toggleOffer(ProductId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-on-offer/${ProductId}`, {}, {headers: getAuthHeaders()});
  }
 
  toggleOnOfferOfMultipleProducts(ProductIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-on-offer-of-multiple-products`, {ProductIds}, {headers: getAuthHeaders()});
  }

  toggleFlushSaleOfMultipleProducts(ProductIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-multiple-flush-sale-products`, {ProductIds}, {headers: getAuthHeaders()});
  }

  toggleFlushSale(ProductId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-flush-sale-product/${ProductId}`, {}, {headers: getAuthHeaders()});
  }

  toggleCustomisationOfSingleProduct(ProductId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-customisation-of-single-product/${ProductId}`, {}, {headers: getAuthHeaders()});
  }

  toggleMultipleCustomisationOfProducts(ProductIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}toggle-multiple-customisation-of-products`, {ProductIds}, {headers: getAuthHeaders()});
  }

  deleteSingleProduct(ProductId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-single-product/${ProductId}`, {headers: getAuthHeaders()});
  }

  deleteMultipleProducts(ProductIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}delete-multiple-products`, {ProductIds}, {headers: getAuthHeaders()});
  }

  getAllProducts(): Observable<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }>(`${this.API_URL}get-all-products`, {headers: getAuthHeaders()});
  }

  getAllActivatedProducts(): Observable<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }>(`${this.API_URL}get-all-activated-products`);
  }

  getAllActivatedProductsOnOffer(): Observable<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }>(`${this.API_URL}get-all-activated-products-on-offer`, {headers: getAuthHeaders()});
  }

  getAllActivatedProductsOnFlushsale(): Observable<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, products?: Product[] | unknown[] }>(`${this.API_URL}get-all-activated-products-on-flushsale`, {headers: getAuthHeaders()});
  }

  getSingleActivatedProduct(ProductId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, product?: Product | null }>(`${this.API_URL}get-single-activated-product/${ProductId}`);
  }
}
