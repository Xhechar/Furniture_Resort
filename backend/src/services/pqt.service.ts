import { PrismaClient } from "@prisma/client";
import { ProductQuantityTime, Review } from "../interfaces/backend.interfaces";
import { PtQTInteface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";

export class PQTSerice implements PtQTInteface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  public async createPQT(ProductId: string, pqt: ProductQuantityTime): Promise<{ success: boolean; error?: string; message?: string; }> {
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

    let createPQT = await this.prisma.productQuantityTime.create({
      data: {
        ProductQuantityTimeId: v4(),
        ProductId,
        Quantity: pqt.Quantity,
        Period: pqt.Period
      }
    });

    if (createPQT == null) {
      return {
        'success': false,
        'error': 'Unable to create time period.'
      }
    } else {
      return {
        'success': true,
        'message': 'Product timeline created successfully.'
      }
    }
  }
  public async updatePQT(ProductQuantityTimeId: string, pqt: ProductQuantityTime): Promise<{ success: boolean; error?: string; message?: string; }> {
    let pqtExists = await this.prisma.productQuantityTime.findUnique({
      where: {
        ProductQuantityTimeId
      }
    });

    if (pqtExists == null) {
      return {
        'success': false,
        'error': 'The specified timeline not found.'
      }
    }

    let updatePQT = await this.prisma.productQuantityTime.update({
      data: {
        Quantity: pqt.Quantity,
        Period: pqt.Period
      },
      where: {
        ProductQuantityTimeId
      }
    });

    if (updatePQT == null) {
      return {
        'success': false,
        'error': 'Unable to update timeline.'
      }
    } else {
      return {
        'success': true,
        'message': 'Timeline updated successfully.'
      }
    }
  }
  public async deletePQT(ProductQuantityTimeId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let pqtExists = await this.prisma.productQuantityTime.findUnique({
      where: {
        ProductQuantityTimeId
      }
    });

    if (pqtExists == null) {
      return {
        'success': false,
        'error': 'The specified timeline not found.'
      }
    }

    let deletePQT = await this.prisma.productQuantityTime.delete({
      where: {
        ProductQuantityTimeId: pqtExists.ProductQuantityTimeId
      }
    });

    if (deletePQT == null) {
      return {
        'success': false,
        'error': 'Unable to delete timeline.'
      }
    } else {
      return {
        'success': true,
        'message': 'Timeline deleted successfully.'
      }
    }
  }
  public async getPQTByProductId(ProductId: string): Promise<{ success: boolean; error?: string; message?: string; pqts?: ProductQuantityTime[] | unknown[]; }> {
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

    let pqtExists = await this.prisma.productQuantityTime.findMany({
      where: {
        ProductId
      }
    });

    if (pqtExists == null || pqtExists.length == 0) {
      return {
        'success': false,
        'error': 'The specified timelines not found.'
      }
    } else {
      return {
        'success': true,
        'message': 'Timelines successfully retrieved.',
        'pqts': pqtExists
      }
    }
  }
}