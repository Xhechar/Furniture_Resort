import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomOrder, Order, Product, Progress, User } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user.service';
import { ProductsService } from '../../../services/products.service';
import { ProgressService } from '../../../services/progress.service';
import { OrderService } from '../../../services/order.service';
import { CustomOrderService } from '../../../services/custom-order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  products: Product[] = [];
  recentUsers: User[] = [];
  activeUsers: number = 0;

  customOrders: number = 0;
  completedCustomOrders = 0;
  orders: number = 0;
  completedOrders = 0;
  revenue: number = 0;
  progresses: number = 0;
  completedProgresses: number = 0;

  constructor(private us: UserService, private ps: ProductsService, private cos: CustomOrderService, private os: OrderService, private prs: ProgressService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getRecentUsers();
    this.getCustomOrders();
    this.getProgresses();
  }

  getProducts() {
    this.ps.getAllProducts().subscribe((res) => {
      if (res.success) {
        this.products = res.products as Product[];
      }
    });
  }

  getRecentUsers() {
    this.us.getAllUsers().subscribe((res) => {
      if (res.success) {
        this.recentUsers = res.users as User[];
        this.activeUsers = this.recentUsers.filter((user: User) => (!user.IsDeleted)).length;
      }
    });
  }

  getCustomOrders() {
    let customOrders: CustomOrder[] = [];
    let orders: Order[] = [];

    this.cos.getAllCustomOrders().subscribe((res) => {
      if (res.success) {
        customOrders = res.customOrders as CustomOrder[];
        this.customOrders = customOrders.length;

        customOrders.forEach((co: CustomOrder) => {
          if ((co.Progresses as Progress[])[0].Status === 'complete') {
            this.revenue += co.Deposit + co.Balance;
            this.completedCustomOrders++;
          }
          this.revenue += co.Deposit
        });
        
      }
    });

    this.os.getAllOrders().subscribe((res) => {
      if (res.success) {
        orders = res.orders as Order[];
        this.orders = orders.length;        

        orders.forEach((o) => {
          this.revenue += o.AmountPaid;
          if (o.DeliveryStatus === 'Delivered') {
            this.completedOrders++;
          }
        });
      }
    });
  }

  
  // orders.reduce((sum, order) => sum + this.calculateOrderTotal(order), 0) +
  // customOrders.reduce((sum, order) => sum + this.calculateCustomOrderTotal(order), 0); 
 
  calculateOrderTotal(order: Order): number {
    return order.Price * order.Quantity * (1 - (order.Discount / 100));
  }
  
  calculateCustomOrderTotal(order: CustomOrder): number {
    return order.Price * order.Quantity * (1 - (order.Discount / 100));
  }

  getProgresses() {
    this.prs.getAllProgresses().subscribe((res: any) => {
      if (res.success) {
        this.progresses = res.progresses.length;
        (res.progresses as Progress[]).forEach((p) => {
          if (p.Status === 'Complete') {
            this.completedProgresses++;
          }
        });
      }
    });
  }
}
