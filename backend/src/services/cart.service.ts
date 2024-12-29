import { PrismaClient } from "@prisma/client";
import { Cart } from "../interfaces/backend.interfaces";
import { CartInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";
import lodach from 'lodash';

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

    let { UserId, CartId, ProductId, DateCreated, User, Product, ...r_cart } = cart;

    let createCart = await this.prisma.cart.create({
      data: {
        CartId: v4(),
        ProductId: productId,
        UserId: userId,
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
  public async updateCart(userId: string, cartId: string, cart: Cart): Promise<{ success: boolean; error?: string; message?: string; }> {

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


    let { UserId, CartId, ProductId, DateCreated, User, Product, ...r_cart } = cart;

    let updateCart = await this.prisma.cart.update({
      data: {
        CartId: cartExists.CartId,
        UserId: cartExists.UserId,
        ProductId: cartExists.ProductId,
        ...r_cart
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
        'error': 'Unable to update Cart.'
      }
    } else {
      return {
        'success': true,
        'message': 'Item successfully updated.'
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