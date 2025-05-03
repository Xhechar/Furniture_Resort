import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { ReviewService } from "../services/reviews.service";

export const reviewsService = new ReviewService();

export class ReviewsController {
  async createReview(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.createReview(getIdFromToken(req), req.params.ProductId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async updateReview(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.updateReview(getIdFromToken(req), req.params.ReviewId, req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async deleteReview(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.deleteReview(req.params.ReviewId);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllReviews(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.getAllReviews();

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getReviewsByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.getReviewsByUserId(getIdFromToken(req));

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }

}