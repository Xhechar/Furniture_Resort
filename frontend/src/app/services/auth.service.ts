import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDetails, Recovery, RecoveryDetails } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL: string = 'http://localhost:3000/'

  constructor(private http: HttpClient) { }

  loginUser(loginDetails: LoginDetails): Observable<{ success: boolean, error?: string, message?: string, Role?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string, Role?: string }>(`${this.API_URL}auth/login`, loginDetails);
  };

  changePassword(recoveryDetails: RecoveryDetails): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}change-password`, recoveryDetails);
  };

  getAllRecoveries(): Observable<{ success: boolean, error?: string, message?: string, recoveries?: Recovery[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, recoveries?: Recovery[] }>(`${this.API_URL}recoveries`);
  };

  verifyMail(email: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}verify-mail`, { Email: email });
  };
}
