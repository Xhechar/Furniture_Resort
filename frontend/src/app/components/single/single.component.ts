import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../interfaces/interfaces';
import { ProductsService } from '../../services/products.service';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-single',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationsComponent],
  templateUrl: './single.component.html',
  styleUrl: './single.component.css'
})
export class SingleComponent implements OnInit {
  product!: Product;
  similarProducts: Product[] = [];
  selectedImage!: string;
  quantity: number = 1;
  activeTab: string = 'description';
  averageRating: number = 0;

  constructor(private route: ActivatedRoute, private ps: ProductsService, private ns: NotificationsService) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('ProductId') as string;

    this.loadProductData(productId);
    this.loadSimilarProducts();
    this.calculateAverageRating();
  }

  loadProductData(productId: string): void {

    this.ps.getSingleActivatedProduct(productId).subscribe({
      next: (value) => {
        if (value.success) {
          this.product = value.product as Product;
          console.log(this.product);
          this.selectedImage = this.product.ProductImages.split(', ')[0];
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  loadSimilarProducts(): void {

    this.ps.getAllActivatedProducts().subscribe({
      next: (products) => {
        if (products.success) {
          this.similarProducts = (products.products as Product[]).filter(product => product.Category === this.product.Category);
        } else {
          this.ns.showMessage(products.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.message, false);
      }
    });

    // Dummy similar products data
    // this.similarProducts = [
    //   {
    //     ProductId: 'product2',
    //     ProductName: 'Modern Lounge Chair',
    //     ProductImages: "https://i.pinimg.com/236x/23/c6/27/23c627933154523f2f7b38c18876cc4f.jpg",
    //     ShortDesc: 'Contemporary lounge chair with sleek design and premium comfort.',
    //     LongDesc: 'A modern take on classic comfort.',
    //     Sizes: 'Standard',
    //     Category: 'Lounge Chairs',
    //     Colour: 'Grey',
    //     Prize: 499.99,
    //     StockQuantity: 8,
    //     StockLimit: 3,
    //     CustomPrize: 649.99,
    //     OnOffer: true,
    //     OnFlushSale: false,
    //     Discount: 10,
    //     MakePeriods: 10,
    //     Deposit: 150,
    //     DateCreated: new Date('2024-01-20'),
    //     IsActivated: true,
    //     IsCustommable: true,
    //     Reviews: [
    //       {
    //         ReviewId: 'rev4',
    //         ProductId: 'product2',
    //         UserId: 'user1',
    //         ReviewText: 'Comfortable and stylish.',
    //         Rating: 5,
    //         DateCreated: '2024-02-25'
    //       }
    //     ]
    //   },
    //   {
    //     ProductId: 'product3',
    //     ProductName: 'Classic Rocking Chair',
    //     ProductImages: "https://i.pinimg.com/236x/23/c6/27/23c627933154523f2f7b38c18876cc4f.jpg",
    //     ShortDesc: 'Traditional wooden rocking chair with curved runners and comfortable seat.',
    //     LongDesc: 'A timeless classic for any home.',
    //     Sizes: 'Standard',
    //     Category: 'Rocking Chairs',
    //     Colour: 'Oak',
    //     Prize: 449.99,
    //     StockQuantity: 15,
    //     StockLimit: 5,
    //     CustomPrize: 599.99,
    //     OnOffer: false,
    //     OnFlushSale: true,
    //     Discount: 0,
    //     MakePeriods: 12,
    //     Deposit: 120,
    //     DateCreated: new Date('2024-01-25'),
    //     IsActivated: true,
    //     IsCustommable: true,
    //     Reviews: [
    //       {
    //         ReviewId: 'rev5',
    //         ProductId: 'product3',
    //         UserId: 'user2',
    //         ReviewText: 'Perfect for my front porch.',
    //         Rating: 4,
    //         DateCreated: '2024-03-01'
    //       }
    //     ]
    //   },
    //   {
    //     ProductId: 'product4',
    //     ProductName: 'Vintage Dining Chair',
    //     ProductImages: "https://i.pinimg.com/236x/23/c6/27/23c627933154523f2f7b38c18876cc4f.jpg",
    //     ShortDesc: 'Elegant dining chair with vintage-inspired design and comfortable upholstery.',
    //     LongDesc: 'Add sophistication to your dining area.',
    //     Sizes: 'Standard',
    //     Category: 'Dining Chairs',
    //     Colour: 'Mahogany',
    //     Prize: 349.99,
    //     StockQuantity: 24,
    //     StockLimit: 10,
    //     CustomPrize: 449.99,
    //     OnOffer: true,
    //     OnFlushSale: false,
    //     Discount: 5,
    //     MakePeriods: 8,
    //     Deposit: 100,
    //     DateCreated: new Date('2024-02-05'),
    //     IsActivated: true,
    //     IsCustommable: true,
    //     Reviews: [
    //       {
    //         ReviewId: 'rev6',
    //         ProductId: 'product4',
    //         UserId: 'user3',
    //         ReviewText: 'Beautiful chairs for my dining set.',
    //         Rating: 5,
    //         DateCreated: '2024-03-10'
    //       }
    //     ]
    //   }
    // ];
  }

  calculateAverageRating(): void {
    if (this.product && this.product.Reviews && this.product.Reviews.length > 0) {
      const total = this.product.Reviews.reduce((sum, review) => sum + review.Rating, 0);
      this.averageRating = total / this.product.Reviews.length;
    } else {
      this.averageRating = 0;
    }
  }

  getStarsArray(rating: number): any[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number): any[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.product.StockQuantity) {
      this.quantity++;
    }
  }

  getStockStatus(): string {
    if (this.product.StockQuantity === 0) {
      return 'Out of Stock';
    } else if (this.product.StockQuantity <= this.product.StockLimit) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }

  calculateDiscountedPrice(): number {
    if (this.product.OnOffer) {
      return this.product.Prize - (this.product.Discount);
    }
    return this.product.Prize;
  }

  addToCart(): void {
    
  }

  addToWishlist(product?: Product): void {
    const selectedProduct = product || this.product;
    console.log(`Added ${selectedProduct.ProductName} to wishlist`);
    // Implement actual wishlist functionality here
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getProductRating(product: Product): number {
    if (product.Reviews && product.Reviews.length > 0) {
      const total = product.Reviews.reduce((sum, review) => sum + review.Rating, 0);
      return total / product.Reviews.length;
    }
    return 0;
  }
}
