import { PrismaClient } from "@prisma/client";
import { Order, orderDetails } from "../interfaces/backend.interfaces";
import { OrderInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";

export class OrderService implements OrderInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  
  public async createOrder(UserId: string, order: orderDetails): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to make an order.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let cartExists = await this.prisma.cart.findMany({
      where: {
        UserId,
        OrderType: 'normal'
      },
      include: {
        Product: true
      }
    });

    if (cartExists.length == 0) {
      return {
        'success': false,
        'error': 'You have no orders at the moment.'
      }
    }

    let uncreatedOrders: string[] = [];
    let deleteCartCount: number = 0;
    let decreaseStock: number = 0;
    let odersCount: number = 0;

    for (let cartExist of cartExists) {
      let createOrder = this.prisma.order.create({
        data: {
          OrderId: v4(),
          UserId: cartExist.UserId,
          ProductId: cartExist.ProductId,
          Quantity: cartExist.Quantity,
          Price: cartExist.Price,
          AmountPaid: order.AmountPaid,
          OrderType: order.OrderType,
          Discount: cartExist.Discount,
          MpesaCode: order.MpesaCode
        }
      });

      if (createOrder == null) {
        uncreatedOrders.push(cartExist.Product.ProductName);
        continue;
      }

      let updateStockQuantity = await this.prisma.product.update({
        data: {
          StockQuantity: (cartExist.Product.StockQuantity - cartExist.Quantity)
        },
        where: {
          ProductId: cartExist.ProductId
        }
      });

      if (updateStockQuantity == null) {
        decreaseStock++;
      }

      let clearCart = await this.prisma.cart.delete({
        where: {
          CartId: cartExist.CartId
        }
      });

      if (clearCart == null) {
        deleteCartCount++;
      }

      await this.prisma.user.update({
        data: {
          HasOrder: true
        },
        where: {
          UserId
        }
      });

      odersCount++;
    }

    if (cartExists.length == odersCount) {
      return {
        'success': true,
        'message': `Order made successfully. ${ (decreaseStock == 0 && deleteCartCount == 0) ? 'Thank you.' : '..'}`
      }
    } else {
      return {
        'success': false,
        'error': `Unable to create orders for ${odersCount - uncreatedOrders.length} products. Which are: ${uncreatedOrders.filter(order => order)}.`
      }
    }
  }
  public async updateOrderStatus(UserId: string, OrderId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId,
        Role: 'admin'
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Admin access only, login to confirm delivery.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let orderExists = await this.prisma.order.findUnique({
      where: {
        OrderId
      }
    });

    if (orderExists == null) {
      return {
        'success': false,
        'error': 'The order specified not found.'
      }
    }

    let updateDelivery = this.prisma.order.update({
      data: {
        DeliveryStatus: 'delivered'
      },
      where: {
        OrderId: orderExists.OrderId
      }
    });

    if (updateDelivery == null) {
      return {
        'success': false,
        'error': 'Unable to update delivery status.'
      }
    } else {
      return {
        'success': true,
        'message': 'Delivery status updated successfully.'
      }
    }
  }
  public async deleteOrder(UserId: string, OrderId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId,
        Role: 'admin'
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Admin access only, login to confirm delete.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let orderExists = await this.prisma.order.findUnique({
      where: {
        OrderId
      }
    });

    if (orderExists == null) {
      return {
        'success': false,
        'error': 'The order specified not found.'
      }
    }

    let deleteOrder = this.prisma.order.delete({
      where: {
        OrderId
      }
    });

    if (deleteOrder == null) {
      return {
        'success': false,
        'error': 'Unable to delete order.'
      }
    } else {
      return {
        'success': true,
        'message': 'Order deleted successfully.'
      }
    }
  }
  public async getAllOrders(): Promise<{ success: boolean; error?: string; message?: string; orders?: Order[] | unknown[]; }> {
    let allOrders = await this.prisma.order.findMany({
      include: {
        Product: true,
        User: true
      }
    });
    
    if (allOrders.length == 0) {
      return {
        'success': false,
        'error': 'There are no orders available'
      }
    } else {
      return {
        'success': true,
        'message': 'Orders retrieved successfully.',
        'orders': allOrders
      }
    }
  }

  public async getAllOrdersDelivered(): Promise<{ success: boolean, error?: string, message?: string, orders?: Order[] | unknown[] }> {
    let allOrders = await this.prisma.order.findMany({
      where: {
        DeliveryStatus: 'delivered'
      },
      include: {
        Product: true,
        User: true
      }
    });
    
    if (allOrders.length == 0) {
      return {
        'success': false,
        'error': 'There are no orders available'
      }
    } else {
      return {
        'success': true,
        'message': 'Orders retrieved successfully.',
        'orders': allOrders
      }
    }
  }
  public async getOrdersByUserId(UserId: string): Promise<{ success: boolean; error?: string; message?: string; orders?: Order[] | unknown[]; }> {
    let allOrders = await this.prisma.order.findMany({
      where: {
        UserId
      },
      include: {
        Product: true,
        User: true
      }
    });
    
    if (allOrders.length == 0) {
      return {
        'success': false,
        'error': 'There are no orders available'
      }
    } else {
      return {
        'success': true,
        'message': 'Orders retrieved successfully.',
        'orders': allOrders
      }
    }
  }
  
}