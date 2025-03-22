import { Request, Response } from "express"
import { CartService } from "../services/cart.service"
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";

const cartService = new CartService();

export class CartController {
  async createCart(req: ExtendedRequest, res: Response) {
    try {

      let result = await cartService.createCart(getIdFromToken(req), req.params.ProductId, req.body);

      res.status(201).json(result);
        
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async updateCart(req: ExtendedRequest, res: Response) {
    try {

      let result = await cartService.updateCart(getIdFromToken(req), req.params.CartId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async updateCartProductQuantity(req: ExtendedRequest, res: Response) {
    try {

      let result = await cartService.updateCartProductQuantity(getIdFromToken(req), req.params.CartId, req.body.Quantity);
      
      res.status(201).json(result);

    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async updateCartProductOrderType(req: ExtendedRequest, res: Response) {
    try {

      let result = await cartService.updateCartProductOrderType(getIdFromToken(req), req.params.CartId, req.body.OrderType);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async clearCart(req: ExtendedRequest, res: Response) {
    try {

      let result = await cartService.clearCart(getIdFromToken(req));

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async deleteCart(req: ExtendedRequest, res: Response) {
    try {

      let result = await cartService.deleteCart(getIdFromToken(req), req.params.CartId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  async getCartByUserId(req: ExtendedRequest, res: Response) {
    try {
      let result = await cartService.getCartByUserId(getIdFromToken(req));
      
      res.status(200).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      })
    }
  }
  
}