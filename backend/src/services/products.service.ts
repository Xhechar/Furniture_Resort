import { PrismaClient } from "@prisma/client";
import { Product } from "../interfaces/backend.interfaces";
import { ProductInterface } from "../interfaces/services.coupling.interfaces";
import { date, string } from "joi";
import { NIL, v4 } from "uuid";

export class ProductService implements ProductInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  now = new Date();
  
  public async createProduct(UserId: string, product: Product): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can create.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let { ProductId, OnFlushSale, OnOffer, DateCreated, ProductQuantityTimes, Reviews, Orders, CustomOrders, Carts, Wishlists, Progresses, IsActivated, IsFlushed, ...r_product } = product;

    let createProduct = await this.prisma.product.create({
      data: {
        ProductId: v4(),
        ...r_product
      }
    });

    if (createProduct == null) {
      return {
        'success': false,
        'error': 'Unable to create product.'
      }
    } else {
      return {
        'success': true,
        'message': `${createProduct.ProductName} created successfully.`
      }
    }
  }
  public async updateProduct(UserId: string, productId: string, product: Product): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can update.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findUnique({
      where: {
        ProductId: productId
      }
    });

    if (productExists == null) {
      return {
        'success': false,
        'error': 'Product specified not found.'
      }
    }

    let { ProductId, OnFlushSale, OnOffer, DateCreated, ProductQuantityTimes, Reviews, Orders, CustomOrders, Carts, Wishlists, Progresses, IsActivated, IsFlushed, ...r_product } = product;

    let updateProduct = await this.prisma.product.update({
      data: {
        ProductId: productExists.ProductId,
        ...r_product
      },
      where: {
        ProductId: productExists.ProductId
      }
    });

    if (updateProduct == null) {
      return {
        'success': false,
        'error': 'Unable to create product.'
      }
    } else {
      return {
        'success': true,
        'message': 'Product created successfully.'
      }
    }
  }
  public async toggleActivationStatus(UserId: string, ProductId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify product status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
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

    let status: boolean = productExists.IsActivated ? false : true;
    
    let updateStatus = await this.prisma.product.update({
      data: { IsActivated: status }, where: { ProductId: productExists.ProductId }
    });

    if (updateStatus == null) {
      return {
        'success': false,
        'error': `Unable to ${status ? 'activate' : 'deactivate'} product.`
      }
    } else {
      return {
        'success': true,
        'message': `Product ${status ? 'activated' : 'deactivated'} successfully.`
      }
    }

  }
  public async toggleActivationOfMultipleProducts(UserId: string, ProductIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findMany({
      where: {
        ProductId: {
          in: ProductIds
        }
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    let statusCount: number = 0;

    for (let productExist of productExists) {

      let status: boolean = productExist.IsActivated ? false : true;
    
      let updateStatus = await this.prisma.product.update({
        data: { IsActivated: status }, where: { ProductId: productExist.ProductId }
      });

      if (updateStatus == null) {
        continue;
      }

      statusCount++;
    }

    if (statusCount == 0) {
      return {
        'success': false,
        'error': 'Unable to update specified products\' status'
      }
    } else {
      return {
        'success': true,
        'message': 'Products updated successfully.'
      }
    }

  }
  public async toggleOnOffer(UserId: string, ProductId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify product status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
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

    let status: boolean = productExists.OnOffer ? false : true;
    
    let updateStatus = await this.prisma.product.update({
      data: { IsActivated: status }, where: { ProductId: productExists.ProductId }
    });

    if (updateStatus == null) {
      return {
        'success': false,
        'error': `Unable to update offer status.`
      }
    } else {
      return {
        'success': true,
        'message': `Product offer status updated successfully.`
      }
    }
  }
  public async toggleOnOfferOfMultipleProducts(UserId: string, ProductIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findMany({
      where: {
        ProductId: {
          in: ProductIds
        }
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    let statusCount: number = 0;

    for (let productExist of productExists) {

      let status: boolean = productExist.OnOffer ? false : true;
    
      let updateStatus = await this.prisma.product.update({
        data: { IsActivated: status }, where: { ProductId: productExist.ProductId }
      });

      if (updateStatus == null) {
        continue;
      }

      statusCount++;
    }

    if (statusCount == 0) {
      return {
        'success': false,
        'error': 'Unable to update products\' offer status'
      }
    } else {
      return {
        'success': true,
        'message': 'Products offer status updated successfully.'
      }
    }
  }
  public async toggleFlushSaleProduct(UserId: string, ProductId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify product status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
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

    let status: boolean = productExists.OnFlushSale ? false : true;
    
    let updateStatus = await this.prisma.product.update({
      data: { IsActivated: status, IsFlushed: true }, where: { ProductId: productExists.ProductId }
    });

    if (updateStatus == null) {
      return {
        'success': false,
        'error': `Unable to update custom status.`
      }
    } else {
      return {
        'success': true,
        'message': `Product custom status updated successfully.`
      }
    }
  }
  public async toggleMultipleFlushSaleProducts(UserId: string, ProductIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findMany({
      where: {
        ProductId: {
          in: ProductIds
        }
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    let statusCount: number = 0;

    for (let productExist of productExists) {

      let status: boolean = productExist.OnFlushSale ? false : true;
    
      let updateStatus = await this.prisma.product.update({
        data: { IsActivated: status, IsFlushed: true }, where: { ProductId: productExist.ProductId }
      });

      if (updateStatus == null) {
        continue;
      }

      statusCount++;
    }

    if (statusCount == 0) {
      return {
        'success': false,
        'error': 'Unable to update products\' flush sale status'
      }
    } else {
      return {
        'success': true,
        'message': 'Products\' flush sale status updated successfully.'
      }
    }
  }

  public async automateFlashSaleProducts(): Promise<{ success: boolean, error?: string, message?: string }>{

    let productsExist = await this.prisma.product.findMany({
      where: {
        IsFlushed: false,
        OnFlushSale: false,
        DateCreated: {
          lt: new Date(this.now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (productsExist == null || productsExist.length == 0) {
      return {
        'success': false,
        'error': 'No products to automate flush sale found.'
      }
    }

    let setCount: number = 0;

    for (let productExist of productsExist) {
      let isTrue: boolean = productExist.StockQuantity >= (productExist.StockLimit * 3);

      if (isTrue) {
        let setFlush = await this.prisma.product.update({
          data: {
            OnFlushSale: true
          },
          where: {
            ProductId: productExist.ProductId
          }
        });

        if (setFlush == null) continue;

        setCount++;
      }
    }

    if (setCount == 0) {
      return {
        'success': false,
        'error': 'Unable to set specified products to flush sale.'
      }
    } else {
      return {
        'success': true,
        'message': 'Products automatically set to flush sale.'
      }
    }
  }
  public async toggleCustomisationOfSingleProduct(UserId: string, ProductId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify product status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
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

    let status: boolean = productExists.IsCustommable ? false : true;
    
    let updateStatus = await this.prisma.product.update({
      data: { IsActivated: status }, where: { ProductId: productExists.ProductId }
    });

    if (updateStatus == null) {
      return {
        'success': false,
        'error': `Unable to update custom status.`
      }
    } else {
      return {
        'success': true,
        'message': `Product custom status updated successfully.`
      }
    }
  }
  public async toggleMultipleCustomisationOfProducts(UserId: string, ProductIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findMany({
      where: {
        ProductId: {
          in: ProductIds
        }
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    let statusCount: number = 0;

    for (let productExist of productExists) {

      let status: boolean = productExist.IsCustommable ? false : true;
    
      let updateStatus = await this.prisma.product.update({
        data: { IsActivated: status }, where: { ProductId: productExist.ProductId }
      });

      if (updateStatus == null) {
        continue;
      }

      statusCount++;
    }

    if (statusCount == 0) {
      return {
        'success': false,
        'error': 'Unable to update specified products\' custom status'
      }
    } else {
      return {
        'success': true,
        'message': 'Products custom status updated successfully.'
      }
    }
  }

  public async deleteSingleProduct(UserId: string, ProductId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify product status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
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

    let deleteProduct = await this.prisma.product.delete({
      where: {
        ProductId: productExists.ProductId
      }
    });

    if (deleteProduct == null) {
      return {
        'success': false,
        'error': 'Unable to delete product.'
      }
    } else {
      return {
        'success': true,
        'message': 'Product deleted successfully.'
      }
    }
  }
  public async deleteMultipleProducts(UserId: string, ProductIds: string[]): Promise<{ success: boolean; error?: string; message?: string; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can modify product status.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findMany({
      where: {
        ProductId: {
          in: ProductIds
        }
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    let deleteCount: number = 0;

    for (let productExist of productExists) {
      let deleteProduct = await this.prisma.product.delete({
        where: {
          ProductId: productExist.ProductId
        }
      });

      if (deleteProduct == null) continue;

      deleteCount++;
    }

    if (deleteCount == 0) {
      return {
        'success': false,
        'error': 'Unable to delete specified products.'
      }
    } else {
      return {
        'success': true,
        'message': 'Products successfully deleted.'
      }
    }
  }
  
  public async getAllActivatedProducts(): Promise<{ success: boolean; error?: string; message?: string; products?: Product[] | unknown[]; }> {

    let productExists = await this.prisma.product.findMany({
      where: {
        IsActivated: true
      },
      include: {
        ProductQuantityTimes: true,
        Reviews: true
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    return {
      'success': true,
      'message': 'Products successfully retrieved.',
      'products': productExists
    }
  }
  public async getAllActivatedProductsOnOffer(): Promise<{ success: boolean; error?: string; message?: string; products?: Product[] | unknown[]; }> {
    let productExists = await this.prisma.product.findMany({
      where: {
        OnOffer: true
      },
      include: {
        ProductQuantityTimes: true,
        Reviews: true,
        Orders: true,
        CustomOrders: true,
        Progresses: true,
        Carts: true,
        Wishlists: true
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    return {
      'success': true,
      'message': 'Products successfully retrieved.',
      'products': productExists
    }
  }
  public async getAllActivatedProductsOnFlushsale(): Promise<{ success: boolean; error?: string; message?: string; products?: Product[] | unknown[]; }> {
    let productExists = await this.prisma.product.findMany({
      where: {
        OnFlushSale: true
      },
      include: {
        ProductQuantityTimes: true,
        Reviews: true,
        Orders: true,
        CustomOrders: true,
        Progresses: true,
        Carts: true,
        Wishlists: true
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    return {
      'success': true,
      'message': 'Products successfully retrieved.',
      'products': productExists
    }
  }
  public async getAllProducts(UserId: string): Promise<{ success: boolean; error?: string; message?: string; products?: Product[] | unknown[]; }> {
    let adminExists = await this.prisma.user.findUnique({
      where: {
        Role: 'admin',
        UserId
      }
    });

    if (adminExists == null) {
      return {
        'success': false,
        'error': 'Only admin can get all products.'
      }
    }

    if (adminExists.IsDeleted) {
      return {
        'success': false,
        'error': `${adminExists.Fullname}, your account is inactive.`
      }
    }

    let productExists = await this.prisma.product.findMany({
      include: {
        ProductQuantityTimes: true,
        Reviews: true,
        Orders: true,
        CustomOrders: true,
        Progresses: true,
        Carts: true,
        Wishlists: true
      }
    });

    if (productExists == null || productExists.length == 0) {
      return {
        'success': false,
        'error': 'Products specified not found.'
      }
    }

    return {
      'success': true,
      'message': 'Products successfully retrieved.',
      'products': productExists
    }
  }
  public async getSingleActivatedProduct(ProductId: string, UserId?: string): Promise<{ success: boolean; error?: string; message?: string; product?: Product | unknown; }> {
    if (UserId == '') {
      let productExists = await this.prisma.product.findUnique({
        where: {
          ProductId
        },
        include: {
          ProductQuantityTimes: true,
          Reviews: true
        }
      });
  
      if (productExists == null) {
        return {
          'success': false,
          'error': 'Product specified not found.'
        }
      }
  
      return {
        'success': true,
        'message': 'Product successfully retrieved.',
        'product': productExists
      }
    }

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to check on product.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    if (userExists.Role == 'user') {
      let productExists = await this.prisma.product.findUnique({
        where: {
          ProductId
        },
        include: {
          ProductQuantityTimes: true,
          Reviews: true
        }
      });
  
      if (productExists == null) {
        return {
          'success': false,
          'error': 'Product specified not found.'
        }
      }
  
      return {
        'success': true,
        'message': 'Product successfully retrieved.',
        'product': productExists
      }
    } else if (userExists.Role == 'admin') {
      let productExists = await this.prisma.product.findUnique({
        where: {
          ProductId
        },
        include: {
          ProductQuantityTimes: true,
          Reviews: true,
          Orders: true,
          CustomOrders: true,
          Progresses: true,
          Carts: true,
          Wishlists: true
        }
      });
  
      if (productExists == null) {
        return {
          'success': false,
          'error': 'Product specified not found.'
        }
      }
  
      return {
        'success': true,
        'message': 'Product successfully retrieved.',
        'product': productExists
      }
    } else {
      return {
        'success': false,
        'error': 'Invalid authentication'
      }
    }
  }
}