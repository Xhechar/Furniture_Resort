import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { ProgressService } from "../services/progress.service";
import { ProductSchema } from "../validators/backend.input.validators";

const progressService = new ProgressService();

export class ProgressController {
  async updateProgress(req: ExtendedRequest, res: Response) {
    try {

      let result = await progressService.updateProgress(getIdFromToken(req), req.params.ProgressId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updateProgressStatus(req: ExtendedRequest, res: Response) {
    try {

      let result = await progressService.updateProgressStatus(getIdFromToken(req), req.params.ProgressId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async approveProgress(req: ExtendedRequest, res: Response) {
    try {

      let result = await progressService.approveProgress(getIdFromToken(req), req.params.ProgressId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async deleteProgress(req: ExtendedRequest, res: Response) {
    try {

      let result = await progressService.deleteProgress(getIdFromToken(req), req.params.ProgressId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllProgresses(req: ExtendedRequest, res: Response) {
    try {

      let result = await progressService.getAllProgresses();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getCompletedProgresses(req: ExtendedRequest, res: Response) {
    try {

      let result = await progressService.getCompletedProgresses();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getProgressesByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await progressService.getProgressesByUserId(getIdFromToken(req));

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  
}