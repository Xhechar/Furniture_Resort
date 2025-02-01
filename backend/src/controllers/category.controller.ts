import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { ExtendedRequest } from "../middlewares/verification.tokens";

const categoryService = new CategoryService();

export class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {

      let result = await categoryService.createCategory(req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }  
  }
  async updateCategory(req: Request, res: Response) {
    try {

      let result = await categoryService.updateCategory(req.params.CategoryId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }  
  }
  async deleteCategory(req: Request, res: Response) {
    try {

      let result = await categoryService.deleteCategory(req.params.CategoryId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }  
  }
  async getAllCategories(req: ExtendedRequest, res: Response) { 
    try {

      let result = await categoryService.getAllCategories();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }  
  }
  
}