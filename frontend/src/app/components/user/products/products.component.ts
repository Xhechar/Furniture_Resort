import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category, PriceRange, Product, PromoSlide } from '../../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { NotificationsService } from '../../../services/notifications.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  wishlist: string[] = [];
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
  
  constructor(private ps: ProductsService, private ns: NotificationsService, private cs: CategoryService) {}
  
  ngOnInit(): void {
    this.fetchProducts();
    
    this.fetchCategories();
    
    this.startSlideShow();
  }
  
  ngOnDestroy(): void {
    // Clear slider interval when component is destroyed
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
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })

    this.filteredProducts = [...this.products];
    this.calculateMaxPrice();
  }
  
  fetchCategories(): void {
  }
  
  calculateMaxPrice(): void {
    const maxProductPrice = Math.max(...this.products.map(p => p.Prize));
    this.maxPrice = Math.ceil(maxProductPrice / 1000) * 1000; // Round up to nearest thousand
    this.priceRange.max = this.maxPrice;
  }
  
  // Slider functions
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
    console.log('Navigate to promo:', id);
    // Implementation would depend on router setup
  }
  
  quickViewPromo(ProductId: string): void {
    // Implementation would depend on modal/dialog setup
  }
  
  // Filter functions
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
    console.log('Filter by price range:', this.priceRange);
  }
  
  filterByRating(rating: number): void {
    this.selectedRating = rating;
  }
  
  applyFilters(): void {
    // Start with all products
    let filtered = [...this.products];
    
    // Apply category filter if categories are selected
    if (this.selectedCategories.length > 0) {
      // This is a mock implementation since we don't have category IDs in the product data
      // In a real app, you would filter based on product category IDs
      filtered = filtered.filter(p => {
        // Mock association between products and categories
        const productCategories = [
          { productId: '1', categoryIds: ['1', '2'] },
          { productId: '2', categoryIds: ['1'] },
          { productId: '3', categoryIds: ['2', '3'] },
          { productId: '4', categoryIds: ['2', '5'] }
        ];
        
        const productCategoryIds = productCategories
          .find(pc => pc.productId === p.ProductId)?.categoryIds || [];
        
        return this.selectedCategories.some(id => productCategoryIds.includes(id));
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
        // This would typically use a 'createdAt' or similar date field
        // For this example, we'll use the ProductId as a proxy for newness
        this.filteredProducts.sort((a, b) => b.DateCreated.getDate() - a.DateCreated.getDate());
        break;
      default: // 'default' - Featured
        // Reset to original order
        this.filteredProducts = [...this.products];
        break;
    }
  }
  
  // Product interaction functions
  quickView(productId: string): void {
    // Implementation would depend on modal/dialog setup
  }
  
  toggleWishlist(productId: string): void {
    if (this.isInWishlist(productId)) {
      this.wishlist = this.wishlist.filter(id => id !== productId);
    } else {
      this.wishlist.push(productId);
    }
  }
  
  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }
  
  addToCompare(productId: string): void {
    // if (this.compareList.includes(productId)) {
    //   this.compareList = this.compareList.filter(id => id !== productId);
    // } else {
    //   // Limit compare list to 4 items
    //   if (this.compareList.length >= 4) {
    //     this.compareList.shift(); // Remove the oldest item
    //   }
    //   this.compareList.push(productId);
    // }
    // console.log('Compare list:', this.compareList);
  }
  
  addToCart(productId: string, pricing: { Discount: number, Price: number }): void {
    //
  }
}
