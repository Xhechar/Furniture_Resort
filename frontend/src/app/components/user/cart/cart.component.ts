import { Component, OnInit } from '@angular/core';
import { Cart, CustomOrder, Order } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  isLoading = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationsService,
    private router: Router,
    private ns: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateAllPrices();
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.cartService.getUserCart().subscribe({
      next: (value) => {
        if(value.success) {
          this.ns.showMessage(value.message as string, value.success);
          this.cartItems = value.carts as Cart[];
          this.isLoading = false;
        } else {
          this.ns.showMessage(value.error as string, false);
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
        this.isLoading = false;
      }
    });
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
    this.calculateSubtotal(item);
  }

  calculateDiscount(item: Cart): number {
    if (!item.Product) return 0;
    return item.Discount;
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
      DeliveryStatus: 'penging'
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
