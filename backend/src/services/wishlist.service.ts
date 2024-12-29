import { PrismaClient, Wishlist } from "@prisma/client";
import { WishlistInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";

export class WishlistService implements WishlistInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  
  public async createWishlist(UserId: string, ProductId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to add itemm to Wishlist.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findUnique({
      where: {
        ProductId
      }
    });

    if (productExists == null) {
      return {
        'success': false,
        'error': 'Product specified not found.'
      }
    }

    let wishlistExists = await this.prisma.wishlist.findFirst({
      where: {
        ProductId,
        UserId
      },
      include: {
        Product: {
          select: {
            ProductName: true
          }
        }
      }
    });

    if (wishlistExists != null) {
      return {
        'success': false,
        'error': `${wishlistExists.Product.ProductName} exists in your wishlist.`
      }
    }

    let createWishlist = await this.prisma.wishlist.create({
      data: {
        WishlistId: v4(),
        ProductId,
        UserId
      }
    });

    if (createWishlist == null) {
      return {
        'success': false,
        'error': `Unable to add ${productExists.ProductName} to wishlist.`
      }
    } else {
      return {
        'success': true,
        'message': `${productExists.ProductName} successfully added to wishlist.`
      }
    }
  }
  public async deleteWishlist(UserId: string, WishlistId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to delete wishlist item.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let wishlistExists = await this.prisma.wishlist.findUnique({
      where: {
        WishlistId,
        UserId
      }
    });

    if (wishlistExists == null) {
      return {
        'success': false,
        'error': `Wishlist item not found.`
      }
    }

    let deleteWishlist = await this.prisma.wishlist.delete({
      where: {
        WishlistId: wishlistExists.WishlistId,
        UserId
      }
    });

    if (deleteWishlist == null) {
      return {
        'success': false,
        'error': 'Unable to delete wishlist item.'
      }
    } else {
      return {
        'success': true,
        'message': 'Item removed successfully from wishlist.'
      }
    }
  }
  public async getWishlistByUserId(UserId: string): Promise<{ success: boolean; error?: string; message?: string; wishlists?: Wishlist[]; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to access wishlist items.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let wishlistExists = await this.prisma.wishlist.findMany({
      where: {
        UserId: userExists.UserId
      },
      include: {
        Product: true
      }
    });

    if (wishlistExists == null || wishlistExists.length == 0) {
      return {
        'success': false,
        'error': `Wishlist items not found.`
      }
    } else {
      return {
        'success': true,
        'message': 'Wishlist items retrieved successfully.',
        'wishlists': wishlistExists
      }
    }

  }
  
}