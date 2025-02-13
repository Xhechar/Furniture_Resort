import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Progress } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private API_URL = 'http://localhost:3000/progress/';

  constructor(private http: HttpClient) { }

  updateProgress(progress: Progress): Observable<{ success: boolean; message?: string; error?: string }> {
    return this.http.put<{ success: boolean; message?: string; error?: string }>(
      `${this.API_URL}update-progress`,
      progress,
      { headers: getAuthHeaders() }
    );
  }

  updateProgressStatus(ProgressId: string): Observable<{ success: boolean; message?: string; error?: string }> {
    return this.http.put<{ success: boolean; message?: string; error?: string }>(
      `${this.API_URL}update-progress-status/${ProgressId}`,
      {},
      { headers: getAuthHeaders() }
    );
  }

  approveProgress(ProgressId: string): Observable<{ success: boolean; message?: string; error?: string }> {
    return this.http.put<{ success: boolean; message?: string; error?: string }>(
      `${this.API_URL}approve-progress/${ProgressId}`,
      {},
      { headers: getAuthHeaders() }
    );
  }

  deleteProgress(ProgressId: string): Observable<{ success: boolean; message?: string; error?: string }> {
    return this.http.delete<{ success: boolean; message?: string; error?: string }>(
      `${this.API_URL}delete-progress/${ProgressId}`,
      { headers: getAuthHeaders() }
    );
  }

  getAllProgresses(): Observable<{ success: boolean; message?: string; error?: string; progresses: Progress[] }> {
    return this.http.get<{ success: boolean; message?: string; error?: string; progresses: Progress[] }>(
      `${this.API_URL}get-all-progresses`,
      { headers: getAuthHeaders() }
    );
  }

  getCompletedProgresses(): Observable<{ success: boolean; message?: string; error?: string; progresses: Progress[] }> {
    return this.http.get<{ success: boolean; message?: string; error?: string; progresses: Progress[] }>(
      `${this.API_URL}get-completed-progresses`,
      { headers: getAuthHeaders() }
    );
  }

  getProgressesByUserId(): Observable<{ success: boolean; message?: string; error?: string; progresses: Progress[] }> {
    return this.http.get<{ success: boolean; message?: string; error?: string; progresses: Progress[] }>(
      `${this.API_URL}get-user-progress`,
      { headers: getAuthHeaders() }
    );
  }
}
