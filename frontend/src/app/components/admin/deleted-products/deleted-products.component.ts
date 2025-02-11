import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-deleted-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deleted-products.component.html',
  styleUrl: './deleted-products.component.css'
})
export class DeletedProductsComponent {
  progresses = [
    {
      ProgressId: '1',
      ProductId: '101',
      UserId: '201',
      CustomOrderId: '301',
      DateCreated: '2025-02-11',
      MaterialsImages: ['https://i.pinimg.com/236x/f7/cc/cf/f7cccf64ffd033bd18399c55a968086b.jpg', 'https://i.pinimg.com/236x/f7/cc/cf/f7cccf64ffd033bd18399c55a968086b.jpg'],
      ProgressImages: ['https://i.pinimg.com/236x/f7/cc/cf/f7cccf64ffd033bd18399c55a968086b.jpg', 'https://i.pinimg.com/236x/f7/cc/cf/f7cccf64ffd033bd18399c55a968086b.jpg'],
      FinalImages: ['https://i.pinimg.com/236x/f7/cc/cf/f7cccf64ffd033bd18399c55a968086b.jpg'],
      Status: 'In Progress',
      DateCompleted: null,
      Product: {
        ProductName: 'Custom Chair',
        ProductImage: 'https://i.pinimg.com/236x/f7/cc/cf/f7cccf64ffd033bd18399c55a968086b.jpg'
      },
      User: {
        UserName: 'John Doe',
        ProfileImage: 'assets/user-john.png'
      }
    },
    // Add more mock data if needed
  ];

  expandedProgressIds: string[] = [];

  toggleDetails(progressId: string) {
    const index = this.expandedProgressIds.indexOf(progressId);
    if (index > -1) {
      this.expandedProgressIds.splice(index, 1); // Collapse
    } else {
      this.expandedProgressIds.push(progressId); // Expand
    }
  }

  onUpdate(progressId: string) {
    console.log('Update progress with ID:', progressId);
  }

  onDelete(progressId: string) {
    console.log('Delete progress with ID:', progressId);
  }

  onMessage(userId: string) {
    console.log('Message user with ID:', userId);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
