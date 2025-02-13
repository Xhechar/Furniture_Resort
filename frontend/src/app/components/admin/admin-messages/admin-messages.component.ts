import { Component } from '@angular/core';
import { ChatUser } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.css'
})
export class AdminMessagesComponent {
  showSidebar = false;
  users: ChatUser[] = [
    {
      id: 1,
      name: 'Real estate deals',
      avatar: 'https://i.pinimg.com/474x/6a/f9/ca/6af9ca755d4d1850c97e89a38a288f24.jpg',
      lastMessage: 'typing...',
      time: '11:15',
      isTyping: true,
      unreadCount: 3
    },
    {
      id: 2,
      name: 'Kate Johnson',
      avatar: 'https://i.pinimg.com/474x/6a/f9/ca/6af9ca755d4d1850c97e89a38a288f24.jpg',
      lastMessage: 'I will send the document s...',
      time: '11:15'
    },
    {
      id: 3,
      name: 'Tamara Shevchenko',
      initials: 'TS',
      lastMessage: 'Are you going to a busine...',
      time: '10:05'
    },
    {
      id: 4,
      name: 'Joshua Clarkson',
      avatar: 'https://i.pinimg.com/474x/6a/f9/ca/6af9ca755d4d1850c97e89a38a288f24.jpg',
      lastMessage: 'I suggest to start, I have n...',
      time: '15:09'
    },
    {
      id: 5,
      name: 'Jeroen Zoet',
      avatar: 'https://i.pinimg.com/474x/6a/f9/ca/6af9ca755d4d1850c97e89a38a288f24.jpg',
      lastMessage: 'We need to start a new re...',
      time: '14:09'
    }
  ];

  activeChat: ChatUser = this.users[0];
  messages = [
    {
      sent: false,
      text: 'Recently I saw properties in a great location that I did not pay attention to before 😌',
      time: '11:20 AM',
      avatar: 'https://i.pinimg.com/474x/6a/f9/ca/6af9ca755d4d1850c97e89a38a288f24.jpg'
    },
    {
      sent: false,
      text: 'Oh, why don\'t you say something more @Robert? 🤔',
      time: '11:21 AM',
      avatar: 'https://i.pinimg.com/474x/6a/f9/ca/6af9ca755d4d1850c97e89a38a288f24.jpg'
    },
    {
      sent: true,
      text: 'He creates an atmosphere of mystery 😏',
      time: '11:22 AM',
      seen: true
    },
    {
      sent: false,
      text: 'Robert, don\'t be like that and say something more 😉',
      time: '11:24 AM',
      avatar: 'https://i.pinimg.com/474x/6a/f9/ca/6af9ca755d4d1850c97e89a38a288f24.jpg'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  selectChat(user: ChatUser): void {
    this.activeChat = user;
    if (user.unreadCount) {
      user.unreadCount = 0;
    }
    this.showSidebar = false;
  }
}
