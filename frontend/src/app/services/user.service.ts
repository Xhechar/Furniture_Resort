import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL: string = 'http://localhost:3000/user'

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/register`, user);
  };

  updateUser(user: Partial<User>): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/update-user`, user);
  };

  updateUserRole(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/update-user-role/${UserId}`, {});
  }
  updateBackgroundPhoto(BackgroundUrl: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/update-background-photo`, { BackgroundUrl });
  }

  softDeleteSngleUser(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/soft-delete-single-user/${UserId}`, {});
  }

  softDeleteMultipleUsers(UserIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/soft-delete-multiple-users`, { UserIds });
  }

  deleteMultipleUsers(UserIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/delete-multiple-users`, { UserIds });
  }

  deleteSingleUser(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/${UserId}`);
  }

  restoreSoftDeletedUser(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/restore-soft-deleted-user/${UserId}`, {});
  }

  restoreMultipleDeletedUsers(UserIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(`${this.API_URL}/restore-multiple-deleted-users`, { UserIds });
  }

  getAllSoftDeletedUsers(): Observable<{ success: boolean, error?: string, message?: string, users?: User[] | unknown[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, users?: User[] | unknown[] }>(`${this.API_URL}/get-all-soft-deleted-users`);
  }

  getAllUsers(): Observable<{ success: boolean, error?: string, message?: string, users?: User[] | unknown[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, users?: User[] | unknown[] }>(`${this.API_URL}/get-all-users`);
  }

  getSingleUser(): Observable<{ success: boolean, error?: string, message?: string, user?: User | unknown }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, user?: User | unknown }>(`${this.API_URL}/get-single-user`);
  }
}
