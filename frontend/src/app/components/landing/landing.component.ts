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

  currentSlide = 'showcase-1';
  showcaseInterval: any;
  activeCategory: string = '';

  constructor(
    private ps: ProductsService,
    private ns: NotificationsService,
    private cs: CategoryService,
    private router: Router
  ) {}

  startSlideshow(): void {
    // Change slides every 5 seconds
    this.showcaseInterval = setInterval(() => {
      let nextSlideNum = parseInt(this.currentSlide.split('-')[1]) + 1;
      if (nextSlideNum > 3) nextSlideNum = 1;
      this.changeSlide(`showcase-${nextSlideNum}`);
    }, 10000);
  }

  changeSlide(slideId: string): void {
    // Clear existing interval and start a new one
    clearInterval(this.showcaseInterval);
    this.startSlideshow();
    
    // Update current slide
    this.currentSlide = slideId;
    
    // Remove active class from all items
    document.querySelectorAll('.showcase-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to selected item
    const selectedItem = document.getElementById(slideId);
    if (selectedItem) {
      selectedItem.classList.add('active');
    }
    
    // Update slider dots
    document.querySelectorAll('.slider-dot').forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-slide') === slideId) {
        dot.classList.add('active');
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up interval when component is destroyed
    if (this.showcaseInterval) {
      clearInterval(this.showcaseInterval);
    }
  }

  ngOnInit() {
    this.getProducts();
    this.getCategories();

    this.startSlideshow();

    // Set up event listeners for the slider dots
    const sliderDots = document.querySelectorAll('.slider-dot');
    sliderDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const slideId = target.getAttribute('data-slide');
        if (slideId) {
          this.changeSlide(slideId);
        }
      });
    });

    this.addAnimationOnScroll();
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

  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  private addAnimationOnScroll(): void {
    // You could implement intersection observer here for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Select all elements to animate
    document.querySelectorAll('.left-images > div, .right-images > div').forEach(el => {
      observer.observe(el);
    });
  }
}