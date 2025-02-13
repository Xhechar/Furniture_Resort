import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Messages } from '../interfaces/interfaces';
import { getAuthHeaders } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  API_URL: string = 'http://localhost:3000/messqges/'

  constructor(private http: HttpClient) { }

  sendMessage(message: Messages): Observable<{ success: boolean; message: string; error?: string }> {
    return this.http.post<{ success: boolean; message: string; error?: string }>(
      `${this.API_URL}send-message`,
      message,
      { headers: getAuthHeaders() }
    );
  }

  updateMessage(MessagesId: string, message: Messages): Observable<{ success: boolean; message: string; error?: string }> {
    return this.http.put<{ success: boolean; message: string; error?: string }>(
      `${this.API_URL}update-message/${MessagesId}`,
      message,
      { headers: getAuthHeaders() }
    );
  }

  deleteMessage(MessagesId: string): Observable<{ success: boolean; error?: string; message?: string }> {
    return this.http.delete<{ success: boolean; error?: string; message?: string }>(
      `${this.API_URL}delete-message/${MessagesId}`,
      { headers: getAuthHeaders() }
    );
  }

  getAllSendersMessages(): Observable<{ success: boolean; message: string; messages: Messages[]; error?: string }> {
    return this.http.get<{ success: boolean; message: string; messages: Messages[]; error?: string }>(
      `${this.API_URL}get-messages`,
      { headers: getAuthHeaders() }
    );
  }

  getMessageByMessageId(MessagesId: string): Observable<{ success: boolean; message: string; messages: Messages; error?: string }> {
    return this.http.get<{ success: boolean; message: string; messages: Messages; error?: string }>(
      `${this.API_URL}get-message/${MessagesId}`,
      { headers: getAuthHeaders() }
    );
  }
}
