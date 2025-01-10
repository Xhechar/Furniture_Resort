import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { ReviewService } from "../services/reviews.service";
import { ReviewSchema } from "../validators/backend.input.validators";

const reviewsService = new ReviewService();

export class ReviewsController {
  async createReview(req: ExtendedRequest, res: Response) {
    try {

      let { error } = ReviewSchema.validate(req.body);

      if (error) return res.status(401).json({ error: error.message });

      let result = await reviewsService.createReview(getIdFromToken(req), req.params.ProductId, req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async updateReview(req: ExtendedRequest, res: Response) {
    try {
      let { error } = ReviewSchema.validate(req.body);

      if (error) return res.status(401).json({ error: error.message });

      let result = await reviewsService.updateReview(getIdFromToken(req), req.params.ReviewId, req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async deleteReview(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.deleteReview(req.params.ReviewId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllReviews(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.getAllReviews();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getReviewsByUserId(req: ExtendedRequest, res: Response) {
    try {

      let result = await reviewsService.getReviewsByUserId(req.params.UserId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }

}