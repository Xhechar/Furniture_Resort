import { Request, Response } from "express";
import { PQTSerice } from "../services/pqt.service";
import { ProductQuantityTimeSchema } from "../validators/backend.input.validators";

const pqtService = new PQTSerice();

export class PQTController{
  async createPQT(req: Request, res: Response) {
    try {
      let { error } = ProductQuantityTimeSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          error: error.message
        });
      }

      let result = await pqtService.createPQT(req.params.ProductId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updatePQT(req: Request, res: Response) {
    try {

      let { error } = ProductQuantityTimeSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          error: error.message
        });
      }

      let result = await pqtService.updatePQT(req.params.ProductQuantityTimeId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async deletePQT(req: Request, res: Response) {
    try {

      let result = await pqtService.deletePQT(req.params.ProductQuantityTimeId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getPQTByProductId(req: Request, res: Response) {
    try {

      let result = await pqtService.getPQTByProductId(req.params.ProductId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }

}