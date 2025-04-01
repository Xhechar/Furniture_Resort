import { Component, OnInit } from '@angular/core';
import { Cart, CustomOrder, MpesaReferals, Order, orderDetails, UpdateCartDto } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { NotificationsService } from '../../../services/notifications.service';
import { CustomOrderService } from '../../../services/custom-order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationsService,
    private router: Router,
    private cos: CustomOrderService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateAllPrices();
  }

  loadCartItems(): void {
    this.cartService.getUserCart().subscribe({
      next: (value) => {
        if (value.success) {
          this.cartItems = [];
          this.cartItems = value.carts as Cart[];
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
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

  updateCartItem(CartId : string, cart: UpdateCartDto): void {
    this.cartService.updateCart(CartId, cart).subscribe({
      next: (response) => {
        if(response.success) {
          this.notificationService.showMessage(response.message as string, true);
          this.cartItems = [];
          this.loadCartItems();
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    })
  }

  removeFromCart(item: Cart): void {
    this.cartService.deleteCart(item.CartId).subscribe({
      next: (response) => {
        if(response.success) {
          this.notificationService.showMessage(response.message as string, true);
          this.cartItems = [];
          this.loadCartItems();
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    })
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (response) => {
        if(response.success) {
          this.notificationService.showMessage(response.message as string, true);
          this.cartItems = [];
          this.loadCartItems();
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    })
  }

  checkoutNormalOrders(): void {
    let order: orderDetails = {
      MpesaCode: ''
    }
    
    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        if(response.success) {
          this.notificationService.showMessage(response.message as string, true);
          this.cartItems = [];
          this.loadCartItems();
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    })
  }

  checkoutCustomOrders(): void {
    let referal: MpesaReferals = ({
      BalMpesaCode: '',
      DepMpesaCode: ''
    })
    this.cos.createCustomOrder(referal).subscribe({
      next: (response) => {
        if(response.success) {
          this.notificationService.showMessage(response.message as string, true);
          this.cartItems = [];
          this.loadCartItems();
        } else {
          this.notificationService.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error.error as string, false);
      }
    })
  }
}
