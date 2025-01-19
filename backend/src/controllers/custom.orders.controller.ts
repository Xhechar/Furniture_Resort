import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { CustomOrderService } from "../services/custom.order.service";

const customOrderService = new CustomOrderService();

export class CustomOrderController {
  async createCustomOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.createCustomOrder(getIdFromToken(req), req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async updateCustomOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.updateCustomOrder(getIdFromToken(req), req.params.CustomOrderId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async updateCustomOrderStatus(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.updateCustomOrderStatus(getIdFromToken(req), req.params.CustomOrderId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async deleteCustomOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.deleteCustomOrder(getIdFromToken(req), req.params.CustomOrderId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async getAllCustomOrders(res: Response) {
    try {

      let result = await customOrderService.getAllCustomOrders();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async getAllCustomOrdersDelivered(res: Response) {
    try {

      let result = await customOrderService.getAllCustomOrdersDelivered();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async getCustomOrdersByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.getCustomOrdersByUserId(getIdFromToken(req));

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  
}