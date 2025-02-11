import { PrismaClient } from "@prisma/client";
import { CustomOrder, MpesaReferals, MpesaReferalsBalance } from "../interfaces/backend.interfaces";
import { CustomOrderInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";
import { ProgressService } from "./progress.service";

export class CustomOrderService implements CustomOrderInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  orderProgress = new ProgressService();
  
  public async createCustomOrder(userId: string, referal: MpesaReferals): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: userId
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
        UserId: userId,
        OrderType: 'custom'
      },
      include: {
        Product: true
      }
    });

    if (cartExists.length == 0) {
      return {
        'success': false,
        'error': 'You have no custom orders at the moment.'
      }
    }

    let createdOrders: string[] = [];
    let uncreatedOrders: string[] = [];
    let odersCount: number = 0;

    for (let cartExist of cartExists) {
      let createProduct = await this.prisma.customOrder.create({
        data: {
          CustomOrderId: v4(),
          ProductId: cartExist.ProductId,
          UserId: cartExist.UserId,
          Price: cartExist.Price,
          Discount: cartExist.Product.Discount,
          Quantity: cartExist.Quantity,
          Deposit: cartExist.Product.Deposit,
          Balance: 0,
          DepMpesaCode: referal.DepMpesaCode,
          BalMpesaCode: referal.BalMpesaCode
        }
      });

      if (createProduct == null) {
        uncreatedOrders.push(cartExist.Product.ProductName);
        continue;
      } else {
        createdOrders.push(cartExist.Product.ProductName);

        let isCreated: boolean = (await this.orderProgress.createProgress(userId, createProduct.ProductId)).success;

        if (isCreated) {
          await this.prisma.user.update({
            data: {
              HasOrder: true
            },
            where: { UserId: userId }
          });

          await this.prisma.cart.delete({
            where: {
              CartId: cartExist.CartId
            }
          });

          odersCount++;
        }
        
        continue;
      }
    }

    if (createdOrders.length == odersCount) {
      return {
        'success': true,
        'message': 'Oders created successfully and ready to be made.'
      }
    } else {
      return {
        'success': false,
        'error': `Unable to create orders for ${odersCount - uncreatedOrders.length} products. Which are: ${uncreatedOrders.filter(order => order)}.`
      }
    }

  }
  public async updateCustomOrder(UserId: string, CustomOrderId: string, referal: MpesaReferalsBalance): Promise<{ success: boolean; error?: string; message?: string; }> {
    let customOrderExists = await this.prisma.customOrder.findUnique({
      where: {
        CustomOrderId,
        UserId
      },
      include: {
        User: true,
        Progresses: true
      }
    });

    if (customOrderExists == null) {
      return {
        'success': false,
        'error': 'Order specified not found.'
      }
    }

    if (customOrderExists.User.IsDeleted) {
      return {
        'success': false,
        'error': `${customOrderExists.User.Fullname}, your account is inactive.`
      }
    }

    let updateCustomOrder = await this.prisma.customOrder.update({
      data: {
        Balance: referal.Balance,
        BalMpesaCode: referal.BalMpesaCode
      },
      where: {
        CustomOrderId: customOrderExists.CustomOrderId,
        UserId: customOrderExists.UserId
      }
    });

    if (updateCustomOrder == null) {
      return {
        'success': false,
        'error': 'Unable to make balance payment.'
      }
    } else {
      let success: boolean = (await this.orderProgress.updateProgressStatus(customOrderExists.UserId, customOrderExists.Progresses[0].ProgressId)).success;

      if (success) {
        return {
          'success': true,
          'message': 'Balance payment completed successfully.'
        }
      } else {
        return {
          'success': false,
          'error': 'Balance cleared successfully but unable to update process.'
        }
      }
    }

  }
  public async updateCustomOrderStatus(UserId: string, CustomOrderId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
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

    let orderExists = await this.prisma.customOrder.findUnique({
      where: {
        CustomOrderId
      }
    });

    if (orderExists == null) {
      return {
        'success': false,
        'error': 'The custom order specified not found.'
      }
    }

    let updateDelivery = this.prisma.customOrder.update({
      data: {
        DeliveryStatus: 'delivered'
      },
      where: {
        CustomOrderId: orderExists.CustomOrderId
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
  public async deleteCustomOrder(UserId: string, CustomOrderId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
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

    let deleteCustomOrder = this.prisma.customOrder.delete({
      where: {
        CustomOrderId
      }
    });

    if (deleteCustomOrder == null) {
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
  public async getAllCustomOrders(): Promise<{ success: boolean; error?: string; message?: string; customOrders?: CustomOrder[] | unknown[]; }> {
    let allCustomOrders = await this.prisma.customOrder.findMany({
      include: {
        Progresses: true,
        Product: true,
        User: true
      }
    });
    
    if (allCustomOrders.length == 0) {
      return {
        'success': false,
        'error': 'There are no custom orders available'
      }
    } else {
      return {
        'success': true,
        'message': 'Orders retrieved successfully.',
        'customOrders': allCustomOrders
      }
    }
  }

  public async getAllCustomOrdersDelivered(): Promise<{ success: boolean, error?: string, message?: string, customOrders?: CustomOrder[] | unknown[] }> {
    let allCustomOrders = await this.prisma.customOrder.findMany({
      where: {
        DeliveryStatus: 'delivered'
      },
      include: {
        Progresses: true,
        Product: true,
        User: true
      }
    });
    
    if (allCustomOrders.length == 0) {
      return {
        'success': false,
        'error': 'There are no custom orders available'
      }
    } else {
      return {
        'success': true,
        'message': 'Orders retrieved successfully.',
        'customOrders': allCustomOrders
      }
    }
  }
  public async getCustomOrdersByUserId(UserId: string): Promise<{ success: boolean; error?: string; message?: string; customOrders?: CustomOrder[] | unknown[]; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to access your orders.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let allCustomOrders = await this.prisma.customOrder.findMany({
      where: {
        UserId
      },
      include: {
        Progresses: true,
        Product: true,
        User: true
      }
    });
    
    if (allCustomOrders.length == 0) {
      return {
        'success': false,
        'error': 'There are no custom orders available'
      }
    } else {
      return {
        'success': true,
        'message': 'Orders retrieved successfully.',
        'customOrders': allCustomOrders
      }
    }
  }
  
}