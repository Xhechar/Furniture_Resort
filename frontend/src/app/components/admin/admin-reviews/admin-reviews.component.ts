import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css'
})
export class AdminReviewsComponent {
  reviews = [
    {
      name: 'Nina Holloway',
      date: '29 Aug 2017',
      avatar: 'https://via.placeholder.com/50',
      content:
        "So you're going abroad, you've chosen your destination and now you have to choose a hotel. Ten years ago, you'd have probably visited your local travel agent...",
      rating: 5,
      comments: 7,
      highlighted: true
    },
    {
      name: 'Steve Fletcher',
      date: '30 Aug 2017',
      avatar: 'https://via.placeholder.com/50',
      content:
        "Whether it's a driving tour, a cruise or a bus, leaf viewing is a great way to spend a fall vacation. It's also big tour business...",
      rating: 4,
      comments: 6,
      highlighted: false
    },
    {
      name: 'Oscar Rogers',
      date: '29 Aug 2017',
      avatar: 'https://via.placeholder.com/50',
      content:
        "It's also big tour business and there are many options. As you dream of that hot apple cider on a crisp afternoon...",
      rating: 3,
      comments: 2,
      highlighted: false
    }
  ];
}
