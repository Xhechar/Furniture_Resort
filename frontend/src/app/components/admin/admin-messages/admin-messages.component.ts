import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [],
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.css'
})
export class AdminMessagesComponent {
  messages = [
    {
      type: 'received',
      text: 'Recently I saw properties in a great location that I did not pay attention to before 😌',
      time: '11:20 AM',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      type: 'received',
      text: 'Oh, why don’t you say something more @Robert? 🤔',
      time: '11:21 AM',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      type: 'sent',
      text: 'He creates an atmosphere of mystery 😏',
      time: '11:22 AM'
    },
    {
      type: 'received',
      text: 'Robert, don’t be like that and say something more 😉',
      time: '11:24 AM',
      avatar: 'https://via.placeholder.com/40'
    }
  ];
}
