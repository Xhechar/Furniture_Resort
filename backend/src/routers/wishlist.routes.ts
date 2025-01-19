import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const wishlistRouter = Router();

const wishlistController = new WishlistController();

wishlistRouter.post("/create-wishlist/:ProductId", verifyToken, verifyUser, wishlistController.createWishlist);
wishlistRouter.delete("/delete-wishlist/:WishlistId", verifyToken, verifyUser, wishlistController.deleteWishlist);
wishlistRouter.get("/get-user-wishlists", verifyToken, verifyUser, wishlistController.getWishlistByUserId);