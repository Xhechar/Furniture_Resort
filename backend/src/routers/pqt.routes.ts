import { Router } from "express";
import { PQTController } from "../controllers/pqt.controller";
import { verifyAdmin, verifyToken } from "../middlewares/verification.tokens";

export const pqtRouter = Router();

const pqtController = new PQTController();

pqtRouter.post('/create-pqt', verifyToken, verifyAdmin, pqtController.createPQT);
pqtRouter.put('/update-pqt/:ProductQuantityTimeId', verifyToken, verifyAdmin, pqtController.updatePQT);
pqtRouter.delete('delete-pqt/:ProductQuantityTimeId', verifyToken, verifyAdmin, pqtController.deletePQT);
pqtRouter.get('/get-pqt-by-product/:ProductId', pqtController.getPQTByProductId);