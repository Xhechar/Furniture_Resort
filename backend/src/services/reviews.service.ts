import { PrismaClient } from "@prisma/client";
import { Review } from "../interfaces/backend.interfaces";
import { ReviewInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";

export class ReviewService implements ReviewInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  
  public async createReview(UserId: string, ProductId: string, review: Review): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to create a review.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let customOrderExists = await this.prisma.customOrder.findFirst({
      where: {
        UserId: userExists.UserId,
        ProductId,
        DeliveryStatus: 'delivered'
      }
    });

    let orderExists = await this.prisma.order.findFirst({
      where: {
        UserId: userExists.UserId,
        ProductId,
        DeliveryStatus: 'delivered'
      }
    });

    if (orderExists == null && customOrderExists == null) {
      return {
        'success': false,
        'error': 'Unable to make review until order is delivered.'
      }
    }

    let reviewExist = await this.prisma.review.findFirst({
      where: {
        ProductId,
        UserId: userExists.UserId
      }
    });

    if (reviewExist != null) {
      return {
        'success': false,
        'error': 'Review already created.'
      }
    }

    let makeReview = await this.prisma.review.create({
      data: {
        ReviewId: v4(),
        ProductId,
        UserId,
        ReviewText: review.ReviewText,
        Rating: review.Rating
      }
    });

    if (makeReview == null) {
      return {
        'success': false,
        'error': 'Unable to make review at the moment.'
      }
    } else {
      return {
        'success': true,
        'message': 'Thank you for sharing your review.'
      }
    }

  }
  public async updateReview(UserId: string, ReviewId: string, review: Review): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to update review.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let reviewExist = await this.prisma.review.findUnique({
      where: {
        ReviewId,
        UserId: userExists.UserId
      }
    });

    if (reviewExist == null) {
      return {
        'success': false,
        'error': 'Review not found.'
      }
    }

    let updateReview = await this.prisma.review.update({
      data: {
        ReviewText: review.ReviewText,
        Rating: review.Rating
      },
      where: {
        ReviewId: reviewExist.ReviewId,
        UserId: reviewExist.UserId
      }
    });

    if (updateReview == null) {
      return {
        'success': false,
        'error': 'Unable to update review.'
      }
    } else {
      return {
        'success': true,
        'message': 'Review updated successfully.'
      }
    }
  }
  public async deleteReview(ReviewId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let reviewExist = await this.prisma.review.findUnique({
      where: {
        ReviewId
      }
    });

    if (reviewExist == null) {
      return {
        'success': false,
        'error': 'Review not found.'
      }
    }

    let deleteReview = await this.prisma.review.delete({
      where: {
        ReviewId
      }
    });

    if (deleteReview == null) {
      return {
        'success': false,
        'error': 'Unable to delete review.'
      }
    } else {
      return {
        'success': true,
        'message': 'Review deleted successfully.'
      }
    }
  }
  public async getAllReviews(): Promise<{ success: boolean; error?: string; message?: string; reviews?: Review[] | unknown[]; }> {
    let getAllReviews = await this.prisma.review.findMany({
      include: {
        User: true,
        Product: true
      }
    });

    if (getAllReviews == null) {
      return {
        'success': false,
        'error': 'No reviews found.'
      }
    } else {
      return {
        'success': true,
        'message': 'Reviews retrieved successfully.'
      }
    }
  }
  public async getReviewsByUserId(UserId: string): Promise<{ success: boolean; error?: string; message?: string; reviews?: Review[] | unknown[]; }> {
    let userExists = await this.prisma.review.findFirst({
      where: {
        UserId
      },
      include: {
        User: true
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to create a review.'
      }
    }

    if (userExists.User.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.User.Fullname}, your account is inactive.`
      }
    }

    let getAllReviews = await this.prisma.review.findMany({
      include: {
        User: true,
        Product: true
      },
      where: {
        UserId: userExists.UserId
      }
    });

    if (getAllReviews == null) {
      return {
        'success': false,
        'error': 'No reviews found.'
      }
    } else {
      return {
        'success': true,
        'message': 'Reviews retrieved successfully.'
      }
    }
  }
  
}