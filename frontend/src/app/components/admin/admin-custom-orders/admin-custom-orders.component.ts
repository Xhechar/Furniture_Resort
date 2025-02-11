import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomOrder } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-admin-custom-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-custom-orders.component.html',
  styleUrl: './admin-custom-orders.component.css'
})
export class AdminCustomOrdersComponent {
  customOrders = [
    {
      CustomOrderId: '1',
      ProductId: '201',
      UserId: '101',
      Price: 1000,
      Discount: 100,
      Quantity: 2,
      Deposit: 500,
      Balance: 400,
      DateCreated: '2025-02-01',
      DateModified: new Date(),
      DeliveryStatus: false,
      User: { FullName: 'Jane Doe', Email: 'jane@example.com', profileImage: 'jane.jpg' },
      Product: { name: 'Custom Table', image: 'table.jpg' },
      Progresses: [{ step: 'Manufacturing', status: 'In Progress' }],
    },
    {
      CustomOrderId: '2',
      ProductId: '202',
      UserId: '102',
      Price: 500,
      Discount: 50,
      Quantity: 1,
      Deposit: 250,
      Balance: 200,
      DateCreated: '2025-02-02',
      DateModified: new Date(),
      DeliveryStatus: true,
      User: { FullName: 'John Smith', Email: 'john@example.com' },
      Product: { name: 'Custom Chair' },
    },
  ];

  updateCustomOrder(customOrder: string) {
    console.log(`Updating custom order ID: ${customOrder}`);
  }

  deleteCustomOrder(customOrder: string) {
    console.log(`Deleting custom order ID: ${customOrder}`);
  }
}
