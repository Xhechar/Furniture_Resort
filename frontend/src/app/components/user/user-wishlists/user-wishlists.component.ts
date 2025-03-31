import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Product } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-wishlists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-wishlists.component.html',
  styleUrl: './user-wishlists.component.css'
})
export class UserWishlistsComponent implements OnInit {
  // Current logged in user
  currentUser: User = {
    UserId: 'u123',
    Fullname: 'John Doe',
    Email: 'john@example.com',
    Mobile: '+254712345678',
    Country: 'Kenya',
    City: 'Nairobi',
    Gender: 'Male',
    IdentificationNumber: 12345678,
    ProfileImage: 'assets/images/profile.jpg',
    BackgroundWallpaper: 'assets/images/bg.jpg',
    Password: '',
    IsWelcomed: true,
    IsDeleted: false,
    DateCreated: new Date(),
    HasOrder: true,
    HasWishList: true,
    Role: 'user',
    Selected: false
  };

  // Wishlist items with products
  wishlistItems: {
    WishlistId: string;
    ProductId: string;
    UserId: string;
    DateCreated: string;
    product: Product;
  }[] = [
    {
      WishlistId: 'wl1',
      ProductId: 'p1',
      UserId: 'u123',
      DateCreated: '2023-05-15',
      product: {
        ProductId: 'p1',
        ProductName: 'Leather Cross-body Handbag',
        ProductImages: 'https://source.unsplash.com/random/800x800/?handbag',
        ShortDesc: 'Elegant leather handbag with crossbody strap',
        LongDesc: 'This elegant leather handbag features a detachable crossbody strap and multiple compartments.',
        Sizes: 'Small,Medium,Large',
        Category: 'Handbags',
        Colour: 'Brown',
        Prize: 120,
        StockQuantity: 15,
        StockLimit: 5,
        CustomPrize: 150,
        OnOffer: true,
        OnFlushSale: false,
        Discount: 15,
        MakePeriods: 2,
        Deposit: 30,
        DateCreated: new Date('2023-01-10'),
        IsActivated: true,
        IsCustommable: true
      }
    },
    {
      WishlistId: 'wl2',
      ProductId: 'p2',
      UserId: 'u123',
      DateCreated: '2023-06-20',
      product: {
        ProductId: 'p2',
        ProductName: 'African Print Tote Bag',
        ProductImages: 'https://source.unsplash.com/random/800x800/?african,bag',
        ShortDesc: 'Vibrant African print tote with leather handles',
        LongDesc: 'Handmade tote bag featuring authentic African prints with genuine leather handles and a spacious interior.',
        Sizes: 'Standard',
        Category: 'Totes',
        Colour: 'Multicolor',
        Prize: 85,
        StockQuantity: 3,
        StockLimit: 5,
        CustomPrize: 110,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 1,
        Deposit: 0,
        DateCreated: new Date('2023-03-15'),
        IsActivated: true,
        IsCustommable: true
      }
    },
    {
      WishlistId: 'wl3',
      ProductId: 'p3',
      UserId: 'u123',
      DateCreated: '2023-07-05',
      product: {
        ProductId: 'p3',
        ProductName: 'Beaded Clutch Purse',
        ProductImages: 'https://source.unsplash.com/random/800x800/?clutch,purse',
        ShortDesc: 'Elegant beaded clutch for special occasions',
        LongDesc: 'Handcrafted beaded clutch purse perfect for weddings and special events. Features a detachable chain strap.',
        Sizes: 'Small',
        Category: 'Clutches',
        Colour: 'Gold',
        Prize: 65,
        StockQuantity: 8,
        StockLimit: 3,
        CustomPrize: 80,
        OnOffer: false,
        OnFlushSale: true,
        Discount: 20,
        MakePeriods: 1,
        Deposit: 0,
        DateCreated: new Date('2023-04-20'),
        IsActivated: true,
        IsCustommable: false
      }
    }
  ];

  // Recommended products
  recommendedProducts: Product[] = [
    {
      ProductId: 'p4',
      ProductName: 'Leather Laptop Bag',
      ProductImages: 'https://source.unsplash.com/random/800x800/?laptop,bag',
      ShortDesc: 'Professional leather laptop bag with multiple compartments',
      LongDesc: 'Sleek leather laptop bag designed for professionals. Features multiple compartments and padded laptop sleeve.',
      Sizes: 'Standard',
      Category: 'Business',
      Colour: 'Black',
      Prize: 150,
      StockQuantity: 12,
      StockLimit: 5,
      CustomPrize: 180,
      OnOffer: true,
      OnFlushSale: false,
      Discount: 10,
      MakePeriods: 3,
      Deposit: 40,
      DateCreated: new Date('2023-02-15'),
      IsActivated: true,
      IsCustommable: true
    },
    {
      ProductId: 'p5',
      ProductName: 'Woven Beach Tote',
      ProductImages: 'https://source.unsplash.com/random/800x800/?beach,bag',
      ShortDesc: 'Stylish woven tote perfect for beach days',
      LongDesc: 'Handwoven beach tote with cotton lining and inner pocket. Perfect for carrying beach essentials.',
      Sizes: 'Large',
      Category: 'Totes',
      Colour: 'Natural',
      Prize: 45,
      StockQuantity: 20,
      StockLimit: 5,
      CustomPrize: 60,
      OnOffer: false,
      OnFlushSale: false,
      Discount: 0,
      MakePeriods: 1,
      Deposit: 0,
      DateCreated: new Date('2023-05-01'),
      IsActivated: true,
      IsCustommable: false
    },
    {
      ProductId: 'p6',
      ProductName: 'Leather Backpack',
      ProductImages: 'https://source.unsplash.com/random/800x800/?leather,backpack',
      ShortDesc: 'Versatile leather backpack for everyday use',
      LongDesc: 'Premium leather backpack with adjustable straps and multiple pockets for everyday organization.',
      Sizes: 'Medium,Large',
      Category: 'Backpacks',
      Colour: 'Dark Brown',
      Prize: 135,
      StockQuantity: 7,
      StockLimit: 3,
      CustomPrize: 165,
      OnOffer: true,
      OnFlushSale: false,
      Discount: 15,
      MakePeriods: 2,
      Deposit: 35,
      DateCreated: new Date('2023-03-25'),
      IsActivated: true,
      IsCustommable: true
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // In a real app, you would fetch the wishlist items from a service
    console.log('Wishlist component initialized');
  }

  // Calculate the final price after discount
  calculateFinalPrice(product: Product): number {
    if (product.OnOffer) {
      return product.Prize - (product.Prize * product.Discount / 100);
    }
    return product.Prize;
  }

  // Calculate total value of wishlist
  calculateTotalValue(): number {
    return this.wishlistItems.reduce((total, item) => {
      return total + this.calculateFinalPrice(item.product);
    }, 0);
  }

  // Check if product is low on stock
  isLowStock(product: Product): boolean {
    return product.StockQuantity <= product.StockLimit;
  }

  // Get stock message
  getStockMessage(product: Product): string {
    if (product.StockQuantity <= 0) {
      return 'Out of stock';
    } else if (this.isLowStock(product)) {
      return `Only ${product.StockQuantity} left`;
    }
    return 'In stock';
  }

  // View single product
  viewProduct(productId: string): void {
    console.log('Viewing product:', productId);
    // Navigate to product detail page
    this.router.navigate(['/products', productId]);
  }

  // Add product to cart
  addToCart(product: Product): void {
    console.log('Adding to cart:', product);
    // This would call your cart service in a real app
    alert(`Added ${product.ProductName} to cart!`);
  }

  // Remove product from wishlist
  removeFromWishlist(wishlistId: string): void {
    console.log('Removing from wishlist:', wishlistId);
    // In a real app, you would call a service to remove the item
    this.wishlistItems = this.wishlistItems.filter(item => item.WishlistId !== wishlistId);
  }

  // Add product to wishlist
  addToWishlist(product: Product): void {
    // Check if product is already in wishlist
    const existing = this.wishlistItems.find(item => item.ProductId === product.ProductId);
    if (existing) {
      alert('This product is already in your wishlist!');
      return;
    }

    // In a real app, you would call a service to add the item
    console.log('Adding to wishlist:', product);
    
    // For demo purposes, create a new wishlist item
    const newWishlistItem = {
      WishlistId: 'wl' + (this.wishlistItems.length + 1),
      ProductId: product.ProductId,
      UserId: this.currentUser.UserId,
      DateCreated: new Date().toISOString().split('T')[0],
      product: product
    };
    
    this.wishlistItems.push(newWishlistItem);
    alert(`Added ${product.ProductName} to wishlist!`);
  }
}