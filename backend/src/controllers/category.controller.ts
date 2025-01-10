import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

export class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {

      let result = await categoryService.createCategory(req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }  
  }
  async updateCategory(req: Request, res: Response) {
    try {

      let result = await categoryService.updateCategory(req.params.CategoryId, req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }  
  }
  async deleteCategory(req: Request, res: Response) {
    try {

      let result = await categoryService.deleteCategory(req.params.CategoryId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }  
  }
  async getAllCategories(res: Response) {
    try {

      let result = await categoryService.getAllCategories();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }  
  }
  
}