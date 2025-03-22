import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const cartRouter = Router();

const cartController = new CartController();

cartRouter.post('/create-cart/:ProductId', verifyToken, verifyUser, cartController.createCart);
cartRouter.put('/update-cart/:CartId', verifyToken, verifyUser, cartController.updateCart);
cartRouter.put('/update-cart-quantity/:CartId', verifyToken, verifyUser, cartController.updateCartProductQuantity);
cartRouter.put('/update-cart-order-type/:CartId', verifyToken, verifyUser, cartController.updateCartProductOrderType);
cartRouter.delete('/delete-cart/:CartId', verifyToken, verifyUser, cartController.deleteCart);
cartRouter.delete('/clear-cart', verifyToken, verifyUser, cartController.clearCart);
cartRouter.get('/get-user-cart', verifyToken, verifyUser, cartController.getCartByUserId);