import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-a-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a-profile.component.html',
  styleUrl: './a-profile.component.css'
})
export class AProfileComponent implements OnInit {
  user: User = {
    UserId: 'user123',
    Fullname: 'Nathaniel Poole',
    Email: 'nathaniel.poole@example.com',
    Mobile: '+1800-000-0000',
    Country: 'United States',
    City: 'Bridgeport',
    Gender: 'Male',
    IdentificationNumber: 123456789,
    ProfileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    BackgroundWallpaper: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&w=1000&q=80',
    Password: '',
    IsWelcomed: true,
    IsDeleted: false,
    DateCreated: new Date('2023-01-01'),
    HasOrder: true,
    HasWishList: true,
    Role: 'Premium Member',
    Selected: false,
    Orders: [{
      OrderId: '',
      UserId: '',
      ProductId: '',
      Quantity: 0,
      Price: 0,
      AmountPaid: 0,
      OrderType: '',
      Discount: 0,
      DateCreated: '',
      DeliveryStatus: ''
    }, {
      OrderId: '',
      UserId: '',
      ProductId: '',
      Quantity: 0,
      Price: 0,
      AmountPaid: 0,
      OrderType: '',
      Discount: 0,
      DateCreated: '',
      DeliveryStatus: ''
    }, {
      OrderId: '',
      UserId: '',
      ProductId: '',
      Quantity: 0,
      Price: 0,
      AmountPaid: 0,
      OrderType: '',
      Discount: 0,
      DateCreated: '',
      DeliveryStatus: ''
    }], // Dummy data to show count
    WishListProducts: [{
      WishlistId: '',
      ProductId: '',
      UserId: '',
      DateCreated: ''
    }, {
      WishlistId: '',
      ProductId: '',
      UserId: '',
      DateCreated: ''
    }, {
      WishlistId: '',
      ProductId: '',
      UserId: '',
      DateCreated: ''
    }, {
      WishlistId: '',
      ProductId: '',
      UserId: '',
      DateCreated: ''
    }], // Dummy data to show count
    CartItems: [{
      CartId: '',
      ProductId: '',
      UserId: '',
      Quantity: 0,
      Discount: 0,
      Price: 0,
      OrderType: '',
      DateCreated: ''
    }, {
      CartId: '',
      ProductId: '',
      UserId: '',
      Quantity: 0,
      Discount: 0,
      Price: 0,
      OrderType: '',
      DateCreated: ''
    }], // Dummy data to show count
  };

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  updateProfile(): void {
    // Handle profile update logic
    console.log('Updating profile:', this.user);
  }
}
