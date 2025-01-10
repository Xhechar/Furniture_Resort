import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { CustomOrderService } from "../services/custom.order.service";

const customOrderService = new CustomOrderService();

export class CustomOrderController {
  async createCustomOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.createCustomOrder(getIdFromToken(req), req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
  async updateCustomOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.updateCustomOrder(getIdFromToken(req), req.params.CustomOrderId, req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
  async updateCustomOrderStatus(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.updateCustomOrderStatus(getIdFromToken(req), req.params.CustomOrderId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
  async deleteCustomOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.deleteCustomOrder(getIdFromToken(req), req.params.CustomOrderId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
  async getAllCustomOrders(res: Response) {
    try {

      let result = await customOrderService.getAllCustomOrders();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
  async getAllCustomOrdersDelivered(res: Response) {
    try {

      let result = await customOrderService.getAllCustomOrdersDelivered();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
  async getCustomOrdersByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await customOrderService.getCustomOrdersByUserId(getIdFromToken(req));

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
  
}