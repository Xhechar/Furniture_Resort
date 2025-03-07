import { Component, OnInit } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { Category, Product } from '../../interfaces/interfaces';
import { ProductsService } from '../../services/products.service';
import { NotificationsService } from '../../services/notifications.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [TopbarComponent, CommonModule, NotificationsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  constructor(
    private ps: ProductsService,
    private ns: NotificationsService,
    private cs: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    this.loading = true;
    this.ps.getAllActivatedProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.products as Product[];
          setTimeout(() => {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
              (card as HTMLElement).style.setProperty('--i', index.toString());
            });
          }, 100);
        } else {
          this.ns.showMessage(response.message as string, false);
        }
        this.loading = false;
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
        this.loading = false;
      }
    });
  }

  getCategories() {
    this.cs.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories as Category[];
        } else {
          this.ns.showMessage(response.message as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });
  }

  addToCart(product: Product) {
    console.log('Adding to cart:', product);
    this.ns.showMessage(`${product.ProductName} added to cart!`, true);
  }

  addToWishlist(product: Product) {
    console.log('Adding to wishlist:', product);
    this.ns.showMessage(`${product.ProductName} added to wishlist!`, true);
  }

  quickView(ProductId: string) {
    this.router.navigate(['single-product', ProductId]);
  }
}