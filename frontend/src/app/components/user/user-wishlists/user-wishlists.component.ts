import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product, Wishlist, Cart } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistsService } from '../../../services/wishlists.service';
import { ProductsService } from '../../../services/products.service';
import { CartService } from '../../../services/cart.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationsComponent } from "../../notifications/notifications.component";

@Component({
  selector: 'app-user-wishlists',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent, RouterLink],
  templateUrl: './user-wishlists.component.html',
  styleUrl: './user-wishlists.component.css'
})
export class UserWishlistsComponent implements OnInit {

  wishlistItems: Wishlist[] = [];

  recommendedProducts: Product[] = [];

  constructor(private router: Router, private ws: WishlistsService, private ps: ProductsService, private cs: CartService, private ns: NotificationsService) { }

  ngOnInit(): void {
    this.fetchWishlist();
    this.fetchRecommendedProducts();
  }

  fetchWishlist() {
    this.ws.getWishlistByUserId().subscribe({
      next: (response) => {
        if (response.success) {
          this.wishlistItems = response.wishlists as Wishlist[];
          console.log(this.wishlistItems);
          
        } else {
          // this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  fetchRecommendedProducts() {
    this.ps.getAllActivatedProducts().subscribe({
      next: (response) => {
        if (response.success) {
          let products: Product[] = response.products as Product[];
          this.getCategories().forEach(category => {
            let newProducts: Product[] = products.filter(p => p.Category === category);
            newProducts.forEach(p => { this.recommendedProducts.push(p) });
          })
        } else {
          // this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }
  
  getCategories(): string[]{
    let categories: string[] = [];
    this.wishlistItems.forEach((item: Wishlist) => {
      categories.push((item.Product as Product).Category);
    });

    return categories
  }

  calculateFinalPrice(product: Product | undefined): number {
    if (!product) return 0;
    if (product.OnOffer) {
      return product.Prize - (product.Prize - product.Discount);
    }
    return product.Prize;
  }

  calculateTotalValue(): number {
    return this.wishlistItems.reduce((total, item) => {
      return total + this.calculateFinalPrice(item.Product as Product);
    }, 0);
  }

  // Check if product is low on stock
  isLowStock(product: Product | undefined): boolean {
    if (!product) return false;
    return product.StockQuantity <= product.StockLimit;
  }

  // Get stock message
  getStockMessage(product: Product | undefined): string {
    if (!product) return '';
    if (product.StockQuantity <= 0) {
      return 'Out of stock';
    } else if (this.isLowStock(product)) {
      return `Only ${product.StockQuantity} left`;
    }
    return 'In stock';
  }

  viewProduct(productId: string): void {
    this.router.navigate(['user/user-single-product', productId]);
  }

  addToCart(ProductId: string, cart: Partial<Cart>): void {
    this.cs.createCart(ProductId, cart).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, response.success);
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  removeFromWishlist(wishlistId: string): void {
    this.ws.deleteWishlist(wishlistId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, response.success);
          this.wishlistItems = [];
          this.fetchWishlist();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  addToWishlist(ProductId: string): void {
    this.ws.createWishlist(ProductId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, response.success);
          //fetch wishlist items
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }
}