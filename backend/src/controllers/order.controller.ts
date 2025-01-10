import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { OrderService } from "../services/order.service";

let orderService = new OrderService();

export class OrderController {
  async createOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.createOrder(getIdFromToken(req), req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async updateOrderStatus(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.updateOrderStatus(getIdFromToken(req), req.params.OrderId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async deleteOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.deleteOrder(getIdFromToken(req), req.params.OrderId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllOrders(res: Response) {
    try {

      let result = await orderService.getAllOrders();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllOrdersDelivered(res: Response) {
    try {

      let result = await orderService.getAllOrdersDelivered();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getOrdersByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.getOrdersByUserId(getIdFromToken(req));

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  
}