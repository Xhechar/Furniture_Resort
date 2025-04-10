import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Messages, User } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user.service';
import { MessagesService } from '../../../services/messages.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.css'
})
export class AdminMessagesComponent implements OnInit {
  showSidebar = true;
  searchText = '';
  messageInput = '';
  
  currentUser!: User;
  
  users: User[] = [];
  
  activeUser!: User;
  
  messages: Messages[] = [];
  
  typingUsers: {[key: string]: boolean} = {};
  
  unreadMessages: {[key: string]: number} = {};
  
  userLastMessages: { [key: string]: { text: string, time: string } } = {};
  
  updateMessageId: string | null = null;
  updateMessageText: string = '';

  constructor(
    private userService: UserService, 
    private messagesService: MessagesService, 
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.fetchCurrentUser();
    this.fetchUsers();
  }

  // Fetch the current admin user
  fetchCurrentUser(): void {
    this.userService.getSingleUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.currentUser = response.user as User;
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    });
  }
  
  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          const allUsers = response.users as User[];
          this.users = allUsers.filter(user => user.UserId !== this.currentUser?.UserId);
          
          if (this.users.length > 0 && !this.activeUser) {
            this.selectUser(this.users[0]);
          }
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    });
  }
  
  fetchMessages(): void {
    if (!this.activeUser) return;
    
    this.messagesService.getAllSendersMessages(this.activeUser.UserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.messages = response.messages as Messages[];
          
          if (this.unreadMessages[this.activeUser.UserId]) {
            this.unreadMessages[this.activeUser.UserId] = 0;
          }
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    });
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  selectUser(user: User): void {
    this.activeUser = user;
    this.fetchMessages();
    this.showSidebar = false;
  }

  sendMessage(): void {
    if (!this.messageInput.trim() || !this.activeUser) {
      this.notificationService.showMessage('Please enter a message', false);
      return;
    }

    if (this.updateMessageId) {
      this.updateMessage(this.updateMessageId, this.updateMessageText);
      this.updateMessageId = null;
      return;
    }

    const newMessage: Partial<Messages> = {
      SenderId: this.currentUser.UserId,
      ReceiverId: this.activeUser.UserId,
      Message: this.messageInput
    };

    this.messagesService.sendMessage(newMessage).subscribe({
      next: (response) => {
        if (response.success) {
          this.fetchMessages();
          
          this.userLastMessages[this.activeUser.UserId] = {
            text: this.messageInput,
            time: this.formatMessageDate(new Date().toISOString())
          };
          
          this.messageInput = '';
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    });
    this.messageInput = '';
  }

  getSender(userId: string): User | undefined {
    if (userId === this.currentUser?.UserId) {
      return this.currentUser;
    }
    return this.users.find(user => user.UserId === userId);
  }

  formatMessageDate(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  isUserTyping(userId: string): boolean {
    return !!this.typingUsers[userId];
  }

  getLastMessage(userId: string): string {
    return this.userLastMessages[userId]?.text || 'No messages yet';
  }

  getLastMessageTime(userId: string): string {
    return this.userLastMessages[userId]?.time || '';
  }

  getUnreadCount(userId: string): number {
    return this.unreadMessages[userId] || 0;
  }

  getFilteredUsers(): User[] {
    if (!this.searchText.trim() || !this.users) return this.users;
    
    return this.users.filter(user => 
      user.Fullname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  isMessageEditable(dateString: string): boolean {
    const messageTime = new Date(dateString);
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - messageTime.getTime();
    const hourInMs = 60 * 60 * 1000;
    
    return diffInMs <= hourInMs;
  }

  updateMessage(messageId: string, message: string): void {
    this.messagesService.updateMessage(messageId, message).subscribe({
      next: (response) => {
        if (response.success) {
          this.fetchMessages();
          this.notificationService.showMessage(response.message as string, true);
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    });
  }

  deleteMessage(messageId: string): void {
    this.messagesService.deleteMessage(messageId).subscribe({
      next: (response) => {
        if (response.success) {
          this.fetchMessages();
          this.notificationService.showMessage(response.message as string, true);
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    });
  }

  setUpdateMessage(messageId: string, message: string): void {
    this.updateMessageId = messageId;
    this.updateMessageText = message;
    this.messageInput = message;
  }
}