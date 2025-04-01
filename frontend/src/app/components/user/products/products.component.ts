import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cart, Category, PriceRange, Product, PromoSlide, Review, Wishlist } from '../../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { NotificationsService } from '../../../services/notifications.service';
import { CategoryService } from '../../../services/category.service';
import { WishlistsService } from '../../../services/wishlists.service';
import { CartService } from '../../../services/cart.service';
import { NotificationsComponent } from "../../notifications/notifications.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productRatings: number[] = [];
  filteredProducts: Product[] = [];
  wishlists: Wishlist[] = [];
  compareList: number[] = [];
  categories: Category[] = [];
  priceRange: PriceRange = { min: 0, max: 10000 };
  maxPrice: number = 10000;
  selectedRating: number | null = null;
  selectedCategories: string[] = [];
  showFilters: boolean = false;
  
  promotions: PromoSlide[] = [
    {
      id: '1',
      title: "Summer Collection 2025",
      description: "Discover our new summer arrivals with 20% off on selected items",
      image: "https://i.pinimg.com/736x/0b/b5/22/0bb52275417a6fc79f6871764203954f.jpg",
      bgColor: "var(--offer-bg)"
    },
    {
      id: '2',
      title: "Premium Craftsmanship",
      description: "Handcrafted items by our skilled artisans, now available for pre-order",
      image: "https://i.pinimg.com/736x/6c/6d/4f/6c6d4f6e76f447de0431e4a0042f4466.jpg",
      bgColor: "var(--flush-bg)"
    },
    {
      id: '3',
      title: "Limited Edition",
      description: "Exclusive designs available for a limited time only",
      image: "https://i.pinimg.com/736x/3f/f0/cc/3ff0cc2f1b95bc749692aa0700721440.jpg",
      bgColor: "var(--total-bg)"
    }
  ];
  
  currentSlide: number = 0;
  slideInterval: any;
  
  constructor(private ps: ProductsService, private ns: NotificationsService, private cs: CategoryService, private router: Router, private ws: WishlistsService, private cts: CartService) {}
  
  ngOnInit(): void {
    this.fetchWishlists();
    
    this.fetchProducts();
    
    this.fetchCategories();

    
    this.startSlideShow();
  }
  
  ngOnDestroy(): void {
    this.clearSlideInterval();
  }

  ceilRating(rating: number): number {
    return Math.ceil(rating);
  }
  
  fetchProducts(): void {

    this.ps.getAllActivatedProducts().subscribe({
      next: (response) => {
        if(response.success) {
          this.products = response.products as Product[];
          this.filteredProducts = [...this.products];
          this.products.forEach(product => {
            const reviews = product.Reviews || [];
            const sum = reviews.reduce((acc, review) => acc + review.Rating, 0);
            const average = reviews.length > 0 ? sum / reviews.length : 0;
            this.productRatings.push(average);
          });
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    // this.calculateMaxPrice();
  }
  
  fetchCategories(): void {
    this.cs.getAllCategories().subscribe({
      next: (response) => {
        if(response.success) {
          this.categories = response.categories as Category[];
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }
  
  calculateMaxPrice(): void {
    const maxProductPrice = Math.max(...this.products.map(p => p.Prize));
    this.maxPrice = Math.ceil(maxProductPrice);
    this.priceRange.max = this.maxPrice;
  }
  
  startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }
  
  clearSlideInterval(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
  
  setSlide(index: number): void {
    this.clearSlideInterval();
    this.currentSlide = index;
    this.startSlideShow();
  }
  
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.promotions.length;
  }
  
  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.promotions.length) % this.promotions.length;
  }
  
  navigateToPromo(id: string): void {
    // Implementation would depend on router setup
  }
  
  quickViewPromo(ProductId: string): void {
    // Implementation would depend on modal/dialog setup
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  filterByCategory(event: any, categoryId: string): void {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
  }
  
  filterByPrice(): void {
    this.filteredProducts = this.products.filter(p => p.Prize >= this.priceRange.min && p.Prize <= this.priceRange.max);
  }
  
  filterByRating(rating: number): void {
    this.selectedRating = rating;
    this.filteredProducts = this.products.filter(p => p.Reviews ? p.Reviews?.reduce((acc: number, curr: Review) => acc + curr.Rating, 0) : 0 >= this.selectedRating!);
  }
  
  applyFilters(): void {
    let filtered = [...this.products];

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p => {
        
        // const productCategoryIds = productCategories
        //   .find(pc => pc.productId === p.ProductId)?.categoryIds || [];
        
        return' this.selectedCategories.some(id => productCategoryIds.includes(id));'
      });
    }
    
    // Apply price filter
    filtered = filtered.filter(p => {
      const effectivePrice = p.Prize;
      return effectivePrice >= this.priceRange.min && effectivePrice <= this.priceRange.max;
    });
    
    // Apply rating filter
    if (this.selectedRating !== null) {
      filtered = filtered.filter(p => (5) >= this.selectedRating!);
    }
    
    // Update filtered products
    this.filteredProducts = filtered;
    
    // Add animation delay for fade-in effect
    setTimeout(() => {
      const productCards = document.querySelectorAll('.product-card');
      productCards.forEach((card, index) => {
        (card as HTMLElement).style.setProperty('--data-index', index.toString());
      });
    }, 0);
  }
  
  resetFilters(): void {
    this.selectedCategories = [];
    this.priceRange = { min: 0, max: this.maxPrice };
    this.selectedRating = null;
    
    // Reset checkboxes and radio buttons
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    const radioButtons = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
        
    // Reset filtered products to all products
    this.filteredProducts = [...this.products];
  }
  
  // Sort function
  sortProducts(event: any): void {
    const sortValue = event.target.value;
    
    switch (sortValue) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.Prize - b.Prize);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.Prize - a.Prize);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => b.DateCreated.getDate() - a.DateCreated.getDate());
        break;
      default:
        this.filteredProducts = [...this.products];
        break;
    }
  }
  
  quickView(productId: string): void {
    this.router.navigate(['user/user-single-product', productId]);
  }
  
  toggleWishlist(productId: string): void {
    this.ws.createWishlist(productId).subscribe({
      next: (response) => {
        if(response.success) {
          this.ns.showMessage(response.message as string, response.success);
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });
  }

  fetchWishlists() {
    this.ws.getWishlistByUserId().subscribe({
      next: (response) => {
        if(response.success) {
          this.wishlists = response.wishlists as Wishlist[];
        } else {
          // this.ns.showMessage(response.error as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    })
  }
  
  isInWishlist(productId: string): boolean {
    return this.wishlists.some(wl => wl.ProductId === productId)
  }
  
  addToCompare(productId: string): void {
    this.ns.showMessage('Product added successfully to compare list.', true);
  }
  
  addToCart(productId: string, cart: Partial<Cart>): void {
    console.log(`Creadentials, i've got are Id: ${productId}, and cart: ${cart}`);
    
    this.cts.createCart(productId, cart).subscribe({
      next: (response) => {
        if(response.success) {
          this.ns.showMessage(response.message as string, response.success);
          console.log("This is definately after success!!");
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
