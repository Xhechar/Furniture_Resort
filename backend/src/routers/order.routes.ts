import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const orderRouter = Router();

const orderController = new OrderController();

orderRouter.post("/create-order", verifyToken, verifyUser, orderController.createOrder);
orderRouter.put("/update-order-status/:OrderId", verifyToken, verifyAdmin, orderController.updateOrderStatus);
orderRouter.delete("/delete-order/:OrderId", verifyToken, verifyAdmin, orderController.deleteOrder);
orderRouter.get("/get-all-orders", verifyToken, verifyAdmin, orderController.getAllOrders);
orderRouter.get("/get-all-orders-delivered", verifyToken, verifyAdmin, orderController.getAllOrdersDelivered);
orderRouter.get("/get-all-user-orders", verifyToken, verifyAdmin, orderController.getAllOrdersDelivered);
