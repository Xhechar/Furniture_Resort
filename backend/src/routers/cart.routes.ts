import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const cartRouter = Router();

const cartController = new CartController();

cartRouter.post('/create-cart/:productId', verifyToken, verifyUser, cartController.createCart);
cartRouter.put('/update-cart/:CartId', verifyToken, verifyUser, cartController.updateCart);
cartRouter.delete('/delete-cart/:CartId', verifyToken, verifyUser, cartController.deleteCart);
cartRouter.get('/get-user-cart/:userId', verifyToken, verifyUser, cartController.getCartByUserId);