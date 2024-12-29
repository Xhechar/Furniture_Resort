import { PrismaClient } from "@prisma/client";
import { Category } from "../interfaces/backend.interfaces";
import { CategoryInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";

export class CategoryService implements CategoryInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  public async createCategory(category: Category): Promise<{ success: boolean; error?: string; message?: string; }> {
    
    let createCategory = await this.prisma.category.create({
      data: {
        CategoryId: v4(),
        CategoryName: category.CategoryName
      }
    });

    if (createCategory == null) {
      return {
        'success': false,
        'error': 'Unable to create category at the moment.'
      }
    } else {
      return {
        'success': true,
        'message': `${createCategory.CategoryId} successfully created.`
      }
    }
  }
  public async updateCategory(CategoryId: string, category: Category): Promise<{ success: boolean; error?: string; message?: string; }> {
    
    let categoryExists = await this.prisma.category.findUnique({
      where: {
        CategoryId
      }
    });

    if (categoryExists == null) {
      return {
        'success': false,
        'error': 'Category specified is not found.'
      }
    } else {
      return {
        'success': true,
        'message': `${categoryExists.CategoryId} updated successfully.`
      }
    }
  }
  public async deleteCategory(CategoryId: string): Promise<{ success: boolean; error?: string; message?: string; }> {

    let categoryExists = await this.prisma.category.findUnique({
      where: {
        CategoryId
      }
    });

    if (categoryExists == null) {
      return {
        'success': false,
        'error': 'Category specified is not found.'
      }
    } else {
      let deleteCategory = await this.prisma.category.delete({
        where: {
          CategoryId
        }
      });

      if (!deleteCategory) {
        return {
          'success': false,
          'error': 'Unable to delete category at the moment.'
        }
      } else {
        return {
          'success': true,
          'message': `${deleteCategory.CategoryName} deleted successfully.`
        }
      }
    }
  }
  public async getAllCategories(): Promise<{ success: boolean; error?: string; message?: string; categories?: Category[] | unknown[]; }> {
    let categoriesExist = await this.prisma.category.findMany();

    if (categoriesExist.length == 0) {
      return {
        'success': false,
        'error': 'There are no categories at the moment'
      }
    } else {
      return {
        'success': true,
        'message': 'Categories retrieved successfully.',
        'categories': categoriesExist
      }
    }
  }
  
}