import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Product, Wishlist } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistsService } from '../../../services/wishlists.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-user-wishlists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-wishlists.component.html',
  styleUrl: './user-wishlists.component.css'
})
export class UserWishlistsComponent implements OnInit {
  dum: Product = {
    ProductId: '',
    ProductName: '',
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
  }

  wishlistItems: Wishlist[] = [];

  recommendedProducts: Product[] = [];

  constructor(private router: Router, private ws: WishlistsService, private ps: ProductsService) { }

  ngOnInit(): void {

  }

  calculateFinalPrice(product: Product): number {
    if (product.OnOffer) {
      return product.Prize - (product.Prize * product.Discount / 100);
    }
    return product.Prize;
  }

  // Calculate total value of wishlist
  // calculateTotalValue(): number {
  //   return this.wishlistItems.reduce((total, item) => {
  //     return total + this.calculateFinalPrice(item.Products);
  //   }, 0);
  // }

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
  // addToWishlist(product: Product): void {
  //   // Check if product is already in wishlist
  //   const existing = this.wishlistItems.find(item => item.ProductId === product.ProductId);
  //   if (existing) {
  //     alert('This product is already in your wishlist!');
  //     return;
  //   }

  //   // In a real app, you would call a service to add the item
  //   console.log('Adding to wishlist:', product);
    
  //   // For demo purposes, create a new wishlist item
  //   const newWishlistItem = {
  //     WishlistId: 'wl' + (this.wishlistItems.length + 1),
  //     ProductId: product.ProductId,
  //     UserId: this.currentUser.UserId,
  //     DateCreated: new Date().toISOString().split('T')[0],
  //     product: product
  //   };
    
  //   this.wishlistItems.push(newWishlistItem);
  //   alert(`Added ${product.ProductName} to wishlist!`);
  // }
}