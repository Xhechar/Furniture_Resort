import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { WishlistService } from "../services/wishlist.service";

const wishlistService = new WishlistService();

export class WishlistController {
  async createWishlist(req: ExtendedRequest, res: Response) {
    try {

      let result = await wishlistService.createWishlist(getIdFromToken(req), req.params.ProductId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async deleteWishlist(req: ExtendedRequest, res: Response) {
    try {

      let result = await wishlistService.deleteWishlist(getIdFromToken(req), req.params.WishlistId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getWishlistByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await wishlistService.getWishlistByUserId(getIdFromToken(req));

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  
}