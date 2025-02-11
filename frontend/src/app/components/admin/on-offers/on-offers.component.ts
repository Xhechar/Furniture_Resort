import { Component } from '@angular/core';
import { Order } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-on-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './on-offers.component.html',
  styleUrl: './on-offers.component.css'
})
export class OnOffersComponent {
  orders: Order[] = [
    {
      OrderId: '1',
      UserId: '101',
      ProductId: '201',
      Quantity: 2,
      Price: 100,
      AmountPaid: 80,
      OrderType: 'Online',
      Discount: 10,
      DateCreated: '2025-02-01',
      DeliveryStatus: 'Pending',
      User: {
        Fullname: 'Jane Doe', Email: 'jane@example.com', ProfileImage: 'jane.jpg',
        UserId: '',
        Mobile: '',
        Country: '',
        City: '',
        Gender: '',
        IdentificationNumber: 0,
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: false,
        IsDeleted: false,
        DateCreated: new Date(),
        HasOrder: false,
        HasWishList: false,
        Role: '',
        Selected: false
      },
      Product: {
        ProductName: 'Chair', ProductImages: 'chair.jpg',
        ProductId: '',
        ShortDesc: '',
        LongDesc: '',
        Sizes: '',
        Category: '',
        Colour: '',
        Prize: 0,
        StockQuantity: 0,
        StockLimit: 0,
        CustomPrize: 0,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date(),
        IsActivated: false,
        IsCustommable: false
      },
    },
    {
      OrderId: '2',
      UserId: '102',
      ProductId: '202',
      Quantity: 1,
      Price: 200,
      AmountPaid: 200,
      OrderType: 'In-Store',
      Discount: 0,
      DateCreated: '2025-02-02',
      DeliveryStatus: 'Completed',
      User: {
        Fullname: 'John Smith', Email: 'john@example.com',
        UserId: '',
        Mobile: '',
        Country: '',
        City: '',
        Gender: '',
        IdentificationNumber: 0,
        ProfileImage: '',
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: false,
        IsDeleted: false,
        DateCreated: new Date(),
        HasOrder: false,
        HasWishList: false,
        Role: '',
        Selected: false
      },
      Product: {
        ProductName: 'Table',
        ProductId: '',
        ProductImages: '',
        ShortDesc: '',
        LongDesc: '',
        Sizes: '',
        Category: '',
        Colour: '',
        Prize: 0,
        StockQuantity: 0,
        StockLimit: 0,
        CustomPrize: 0,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date(),
        IsActivated: false,
        IsCustommable: false
      },
    },
  ];

  updateDeliveryStatus(order: Order) {
    console.log(`Updating delivery status for Order ID: ${order.OrderId}`);
  }

  deleteOrder(order: Order) {
    console.log(`Deleting Order ID: ${order.OrderId}`);
  }
}
