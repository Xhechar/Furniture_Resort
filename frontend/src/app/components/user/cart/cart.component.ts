import { Component, OnInit } from '@angular/core';
import { Cart, CustomOrder, Order } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  isLoading = false;
  
  // Dummy data for development and testing
  dummyCartItems: Cart[] = [
    {
      CartId: '1',
      ProductId: 'p1',
      UserId: 'u1',
      Quantity: 2,
      Discount: 10,
      Price: 1500,
      OrderType: 'normal',
      DateCreated: new Date().toISOString(),
      Product: {
        ProductId: 'p1',
        ProductName: 'Leather Armchair',
        ProductImages: 'assets/images/products/armchair.jpg',
        ShortDesc: 'Premium leather armchair with wooden accents',
        LongDesc: 'Handcrafted premium leather armchair with solid oak wooden accents and premium cushioning for maximum comfort.',
        Sizes: 'Standard',
        Category: 'Furniture',
        Colour: 'Brown',
        Prize: 1500,
        StockQuantity: 15,
        StockLimit: 5,
        CustomPrize: 1800,
        OnOffer: true,
        OnFlushSale: false,
        Discount: 10,
        MakePeriods: 14,
        Deposit: 600,
        DateCreated: new Date(),
        IsActivated: true,
        IsCustommable: true
      }
    },
    {
      CartId: '2',
      ProductId: 'p2',
      UserId: 'u1',
      Quantity: 1,
      Discount: 0,
      Price: 850,
      OrderType: 'custom',
      DateCreated: new Date().toISOString(),
      Product: {
        ProductId: 'p2',
        ProductName: 'Coffee Table',
        ProductImages: 'assets/images/products/coffee-table.jpg',
        ShortDesc: 'Modern coffee table with storage',
        LongDesc: 'Elegant modern coffee table with built-in storage compartments. Made of high-quality wood with a glass top.',
        Sizes: 'Large',
        Category: 'Furniture',
        Colour: 'Walnut',
        Prize: 850,
        StockQuantity: 8,
        StockLimit: 3,
        CustomPrize: 1000,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 7,
        Deposit: 400,
        DateCreated: new Date(),
        IsActivated: true,
        IsCustommable: true
      }
    },
    {
      CartId: '3',
      ProductId: 'p3',
      UserId: 'u1',
      Quantity: 3,
      Discount: 15,
      Price: 350,
      OrderType: 'normal',
      DateCreated: new Date().toISOString(),
      Product: {
        ProductId: 'p3',
        ProductName: 'Throw Pillow Set',
        ProductImages: 'assets/images/products/pillows.jpg',
        ShortDesc: 'Set of 3 decorative throw pillows',
        LongDesc: 'Luxurious set of 3 decorative throw pillows with premium fabric covers and hypoallergenic filling.',
        Sizes: 'Standard',
        Category: 'Home Decor',
        Colour: 'Assorted',
        Prize: 350,
        StockQuantity: 25,
        StockLimit: 5,
        CustomPrize: 450,
        OnOffer: true,
        OnFlushSale: true,
        Discount: 15,
        MakePeriods: 3,
        Deposit: 150,
        DateCreated: new Date(),
        IsActivated: true,
        IsCustommable: true
      }
    }
  ];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // For real implementation, use loadCartItems()
    // For development with dummy data, use the following:
    this.cartItems = this.dummyCartItems;
    this.calculateAllPrices();
  }

  loadCartItems(): void {
    // this.isLoading = true;
    // this.cartService.getCartItems().subscribe({
    //   next: (items) => {
    //     this.cartItems = items;
    //     this.calculateAllPrices();
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     this.notificationService.showError('Failed to load cart items');
    //     this.isLoading = false;
    //     console.error('Error loading cart items:', error);
    //   }
    // });
  }

  incrementQuantity(item: Cart): void {
    if (item.Product && item.Quantity < item.Product.StockQuantity) {
      item.Quantity++;
      this.calculateItemPrice(item);
    }
  }

  decrementQuantity(item: Cart): void {
    if (item.Quantity > 1) {
      item.Quantity--;
      this.calculateItemPrice(item);
    }
  }

  calculateItemPrice(item: Cart): void {
    // This will trigger price recalculations based on quantity and order type
    // The actual calculations are done in the methods below
    this.calculateSubtotal(item);
  }

  calculateDiscount(item: Cart): number {
    if (!item.Product) return 0;
    return (item.Product.Prize * item.Discount) / 100;
  }

  calculateItemPriceAfterDiscount(item: Cart): number {
    if (!item.Product) return 0;
    const discount = this.calculateDiscount(item);
    return item.Product.Prize - discount;
  }

  calculateSubtotal(item: Cart): number {
    const priceAfterDiscount = this.calculateItemPriceAfterDiscount(item);
    return priceAfterDiscount * item.Quantity;
  }

  calculateDepositPercentage(item: Cart): number {
    if (!item.Product) return 0;
    return (item.Product.Deposit / item.Product.CustomPrize) * 100;
  }

  calculateDeposit(item: Cart): number {
    if (!item.Product || item.OrderType !== 'custom') return 0;
    const priceAfterDiscount = this.calculateItemPriceAfterDiscount(item);
    const depositPercentage = this.calculateDepositPercentage(item);
    return (priceAfterDiscount * depositPercentage) / 100 * item.Quantity;
  }

  calculateBalance(item: Cart): number {
    if (!item.Product || item.OrderType !== 'custom') return 0;
    const subtotal = this.calculateSubtotal(item);
    const deposit = this.calculateDeposit(item);
    return subtotal - deposit;
  }

  calculateAllPrices(): void {
    this.cartItems.forEach(item => {
      this.calculateItemPrice(item);
    });
  }

  calculateNormalOrdersSubtotal(): number {
    return this.cartItems
      .filter(item => item.OrderType === 'normal')
      .reduce((sum, item) => sum + this.calculateSubtotal(item), 0);
  }

  calculateTotalDiscount(): number {
    return this.cartItems
      .filter(item => item.OrderType === 'normal')
      .reduce((sum, item) => sum + (this.calculateDiscount(item) * item.Quantity), 0);
  }

  calculateNormalOrdersTotal(): number {
    return this.calculateNormalOrdersSubtotal();
  }

  calculateCustomOrdersSubtotal(): number {
    return this.cartItems
      .filter(item => item.OrderType === 'custom')
      .reduce((sum, item) => sum + this.calculateSubtotal(item), 0);
  }

  calculateCustomOrdersDiscount(): number {
    return this.cartItems
      .filter(item => item.OrderType === 'custom')
      .reduce((sum, item) => sum + (this.calculateDiscount(item) * item.Quantity), 0);
  }

  calculateTotalDeposit(): number {
    return this.cartItems
      .filter(item => item.OrderType === 'custom')
      .reduce((sum, item) => sum + this.calculateDeposit(item), 0);
  }

  calculateTotalBalance(): number {
    return this.cartItems
      .filter(item => item.OrderType === 'custom')
      .reduce((sum, item) => sum + this.calculateBalance(item), 0);
  }

  hasNormalOrders(): boolean {
    return this.cartItems.some(item => item.OrderType === 'normal');
  }

  hasCustomOrders(): boolean {
    return this.cartItems.some(item => item.OrderType === 'custom');
  }

  updateCartItem(item: Cart, formValue: any): void {
    this.isLoading = true;
    
    // In a real implementation, you would update via service
    // this.cartService.updateCartItem(item.CartId, formValue).subscribe({...})
    
    // For dummy implementation, simply update the local item
    item.Quantity = formValue.quantity || item.Quantity;
    item.OrderType = formValue.orderType || item.OrderType;
    
    this.calculateItemPrice(item);
    this.notificationService.showMessage('Cart item updated successfully', true);
    this.isLoading = false;
  }

  removeFromCart(item: Cart): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.isLoading = true;
      
      // For real implementation
      // this.cartService.removeFromCart(item.CartId).subscribe({...})
      
      // For dummy implementation
      this.cartItems = this.cartItems.filter(cartItem => cartItem.CartId !== item.CartId);
      this.notificationService.showMessage('Item removed from cart', true);
      this.isLoading = false;
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.isLoading = true;
      
      // For real implementation
      // this.cartService.clearCart().subscribe({...})
      
      // For dummy implementation
      this.cartItems = [];
      this.notificationService.showMessage('Cart cleared successfully', true);
      this.isLoading = false;
    }
  }

  checkoutNormalOrders(): void {
    const normalOrders = this.cartItems.filter(item => item.OrderType === 'normal');
    
    if (normalOrders.length === 0) {
      this.notificationService.showMessage('No normal orders in cart', false);
      return;
    }
    
    this.isLoading = true;
    
    // Convert cart items to order objects
    const orders: Partial<Order>[] = normalOrders.map(item => ({
      ProductId: item.ProductId,
      UserId: item.UserId,
      Quantity: item.Quantity,
      Price: this.calculateItemPriceAfterDiscount(item),
      AmountPaid: this.calculateSubtotal(item),
      OrderType: 'normal',
      Discount: item.Discount,
      DateCreated: new Date().toISOString(),
      DeliveryStatus: 'Pending'
    }));
    
    // For real implementation
    // this.orderService.createBulkOrders(orders).subscribe({...})
    
    // For dummy implementation
    setTimeout(() => {
      this.notificationService.showMessage('Normal orders placed successfully', true);
      // Remove checked out items from cart
      this.cartItems = this.cartItems.filter(item => item.OrderType !== 'normal');
      this.isLoading = false;
      // Navigate to order confirmation page in real implementation
      // this.router.navigate(['/order-confirmation']);
    }, 1500);
  }

  checkoutCustomOrders(): void {
    const customOrders = this.cartItems.filter(item => item.OrderType === 'custom');
    
    if (customOrders.length === 0) {
      this.notificationService.showMessage('No custom orders in cart', false);
      return;
    }
    
    this.isLoading = true;
    
    // Convert cart items to custom order objects
    const customOrderRequests: Partial<CustomOrder>[] = customOrders.map(item => ({
      ProductId: item.ProductId,
      UserId: item.UserId,
      Price: this.calculateItemPriceAfterDiscount(item),
      Discount: item.Discount,
      Quantity: item.Quantity,
      Deposit: this.calculateDeposit(item),
      Balance: this.calculateBalance(item),
      DateCreated: new Date().toISOString(),
      DateModified: new Date(),
      DeliveryStatus: false
    }));
    
    // For real implementation
    // this.orderService.createBulkCustomOrders(customOrderRequests).subscribe({...})
    
    // For dummy implementation
    setTimeout(() => {
      this.notificationService.showMessage('Custom orders placed successfully', true);
      // Remove checked out items from cart
      this.cartItems = this.cartItems.filter(item => item.OrderType !== 'custom');
      this.isLoading = false;
      // Navigate to custom order confirmation page in real implementation
      // this.router.navigate(['/custom-order-confirmation']);
    }, 1500);
  }
}
