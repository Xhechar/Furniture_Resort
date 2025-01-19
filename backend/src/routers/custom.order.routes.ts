import { Router } from "express";
import { CustomOrderController } from "../controllers/custom.orders.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const cOrderRouter = Router();

const customOrderController = new CustomOrderController();

cOrderRouter.post("/create-custom-order", verifyToken, verifyUser, customOrderController.createCustomOrder);
cOrderRouter.put("/update-custom-order/:CustomOrderId", verifyToken, verifyUser, customOrderController.updateCustomOrder);
cOrderRouter.put("/update-custom-order-status/:CustomOrderId", verifyToken, verifyAdmin, customOrderController.updateCustomOrderStatus);
cOrderRouter.delete("/delete-custom-order/:CustomOrderId", verifyToken, verifyAdmin, customOrderController.deleteCustomOrder);
cOrderRouter.get("/get-all-custom-orders", verifyToken, verifyAdmin, customOrderController.getAllCustomOrders);
cOrderRouter.get("/get-all-custom-orders-delivered", verifyToken, verifyAdmin, customOrderController.getAllCustomOrdersDelivered);
cOrderRouter.get("/get-custom-orders-by-user", verifyToken, verifyUser, customOrderController.getCustomOrdersByUserId);