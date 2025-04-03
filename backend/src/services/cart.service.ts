import { Cart, PrismaClient } from "@prisma/client";
import { CartInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";
import lodach from 'lodash';
import { UpdateCartDto } from "../interfaces/backend.interfaces";

export class CartService implements CartInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  //remember to handle product custom or normal type in angular
  public async createCart(userId: string, productId: string, cart: Cart): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: userId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to add itemm to cart.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, account is inactive.`
      }
    }

    let productExists = await this.prisma.cart.findFirst({
      where: {
        ProductId: productId,
        UserId: userId
      }
    });

    if (productExists) {
      return {
        'success': false,
        'error': 'Item already exists in your cart.'
      }
    }

    let { UserId, CartId, ProductId, DateCreated, OrderType, Quantity, ...r_cart } = cart;

    let createCart = await this.prisma.cart.create({
      data: {
        CartId: v4(),
        ProductId: productId,
        UserId: userId,
        OrderType: cart.OrderType || 'normal',
        ...r_cart
      }
    });

    if (createCart == null) {
      return {
        'success': false,
        'error': 'Unable to add item to Cart.'
      }
    } else {
      return {
        'success': true,
        'message': 'Item successfully added to cart.'
      }
    }
  }
  public async updateCart(userId: string, cartId: string, cart: UpdateCartDto): Promise<{ success: boolean; error?: string; message?: string; }> {

    let cartExists = await this.prisma.cart.findUnique({
      where: {
        UserId: userId,
        CartId: cartId
      }
    });

    if (cartExists == null) {
      return {
        'success': false,
        'error': 'Cart item specified not found.'
      }
    }

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: cartExists.UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to update itemm in cart.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, account is inactive.`
      }
    }

    let updateCart = await this.prisma.cart.update({
      data: {
        ...cart
      },
      where: {
        CartId: cartId,
        UserId: userId,
        ProductId: cartExists.ProductId
      }
    });

    if (updateCart == null) {
      return {
        'success': false,
        'error': 'Unable to update Cart.'
      }
    } else {
      return {
        'success': true,
        'message': 'Item successfully updated.'
      }
    }
  }

  public async updateCartProductQuantity(userId: string, cartId: string, Quantity: number): Promise<{ success: boolean; error?: string; message?: string; }> {

    let cartExists = await this.prisma.cart.findUnique({
      where: {
        UserId: userId,
        CartId: cartId
      }
    });

    if (cartExists == null) {
      return {
        'success': false,
        'error': 'Cart item specified not found.'
      }
    }

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: cartExists.UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to update itemm in cart.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, account is inactive.`
      }
    }

    let updateCart = await this.prisma.cart.update({
      data: {
        Quantity
      },
      where: {
        CartId: cartId,
        UserId: userId,
        ProductId: cartExists.CartId
      }
    });

    if (updateCart == null) {
      return {
        'success': false,
        'error': 'Unable to update quantity.'
      }
    } else {
      return {
        'success': true,
        'message': 'Quantity successfully updated.'
      }
    }
  }

  public async updateCartProductOrderType(userId: string, cartId: string, OrderType: string): Promise<{ success: boolean; error?: string; message?: string; }> {

    let cartExists = await this.prisma.cart.findUnique({
      where: {
        UserId: userId,
        CartId: cartId
      }
    });

    if (cartExists == null) {
      return {
        'success': false,
        'error': 'Cart item specified not found.'
      }
    }

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: cartExists.UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to update itemm in cart.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, account is inactive.`
      }
    }

    let updateCart = await this.prisma.cart.update({
      data: {
        OrderType
      },
      where: {
        CartId: cartId,
        UserId: userId,
        ProductId: cartExists.CartId
      }
    });

    if (updateCart == null) {
      return {
        'success': false,
        'error': 'Unable to update order type.'
      }
    } else {
      return {
        'success': true,
        'message': `Order type successfully updated to ${updateCart.OrderType}.`
      }
    }
  }
  public async deleteCart(userId: string, cartId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let cartExists = await this.prisma.cart.findUnique({
      where: {
        UserId: userId,
        CartId: cartId
      }
    });

    if (cartExists == null) {
      return {
        'success': false,
        'error': 'Cart item specified not found.'
      }
    }

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: cartExists.UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to delete itemm in cart.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, account is inactive.`
      }
    }

    let deleteCart = await this.prisma.cart.delete({
      where: {
        UserId: cartExists.UserId,
        CartId: cartExists.CartId,
        ProductId: cartExists.ProductId
      }
    });

    if (deleteCart == null) {
      return {
        'success': false,
        'error': 'Unable to remove item from cart.'
      }
    } else {
      return {
        'success': true,
        'message': 'Item removed successfully from cart.'
      }
    }
  }

  public async clearCart(userId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let cartExists = await this.prisma.cart.findMany({
      where: {
        UserId: userId
      }
    });

    if (cartExists == null || cartExists.length === 0) {
      return {
        'success': false,
        'error': 'Cart is currently empty.'
      }
    }

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: userId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to delete item in cart.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, account is inactive.`
      }
    }

    let clearCart = await this.prisma.cart.deleteMany({
      where: {
        CartId: {
          in: cartExists.map(cart => cart.CartId)
        }
      }
    });

    if (clearCart == null) {
      return {
        'success': false,
        'error': 'Unable to clear items from cart.'
      }
    } else {
      return {
        'success': true,
        'message': 'Items removed successfully from cart.'
      }
    }
  }
  public async getCartByUserId(UserId: string): Promise<{ success: boolean; error?: string; message?: string; carts?: Cart[] | unknown[]; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to get cart items.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let cartItems = await this.prisma.cart.findMany({
      where: {
        UserId
      },
      include: {
        Product: true
      }
    });

    if (lodach.isEmpty(cartItems)) {
      return {
        'success': false,
        'error': 'cart items not found. Add items to appear here.'
      }
    } else {
      return {
        'success': true,
        'message': 'Cart items retrieved successfully.',
        'carts': cartItems
      }
    }

  }
  
}