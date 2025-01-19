import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { OrderService } from "../services/order.service";

let orderService = new OrderService();

export class OrderController {
  async createOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.createOrder(getIdFromToken(req), req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updateOrderStatus(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.updateOrderStatus(getIdFromToken(req), req.params.OrderId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async deleteOrder(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.deleteOrder(getIdFromToken(req), req.params.OrderId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllOrders(res: Response) {
    try {

      let result = await orderService.getAllOrders();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllOrdersDelivered(res: Response) {
    try {

      let result = await orderService.getAllOrdersDelivered();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getOrdersByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await orderService.getOrdersByUserId(getIdFromToken(req));

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  
}