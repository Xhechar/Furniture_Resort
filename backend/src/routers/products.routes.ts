import { Router } from "express";
import { ProductsController } from "../controllers/products.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const productRouter = Router();

const productsController = new ProductsController();

productRouter.post('/create-product', verifyToken, verifyAdmin, productsController.createProduct);
productRouter.put('/update-product/:ProductId', verifyToken, verifyAdmin, productsController.updateProduct);
productRouter.put('/toggle-activation-status/:ProductId', verifyToken, verifyAdmin, productsController.toggleActivationStatus);
productRouter.put('/toggle-activation-of-multiple-products', verifyToken, verifyAdmin, productsController.toggleActivationOfMultipleProducts);
productRouter.put('/toggle-on-offer/:ProductId', verifyToken, verifyAdmin, productsController.toggleOnOffer);
productRouter.put('/toggle-on-offer-of-multiple-products', verifyToken, verifyAdmin, productsController.toggleOnOfferOfMultipleProducts);
productRouter.put('/toggle-flush-sale-product/:ProductId', verifyToken, verifyAdmin, productsController.toggleFlushSaleProduct);
productRouter.put('/toggle-multiple-flush-sale-products', verifyToken, verifyAdmin, productsController.toggleMultipleFlushSaleProducts);
productRouter.get('/automate-flash-sale-products', verifyToken, verifyAdmin, productsController.automateFlashSaleProducts);
productRouter.put('/toggle-customisation-of-single-product/:ProductId', verifyToken, verifyAdmin, productsController.toggleCustomisationOfSingleProduct);
productRouter.put('/toggle-multiple-customisation-of-products', verifyToken, verifyAdmin, productsController.toggleMultipleCustomisationOfProducts);
productRouter.delete('/delete-multiple-products', verifyToken, verifyAdmin, productsController.deleteMultipleProducts);
productRouter.delete('/delete-single-product/:ProductId', verifyToken, verifyAdmin, productsController.deleteSingleProduct);
productRouter.get('/get-all-activated-products', verifyToken, verifyUser, productsController.getAllActivatedProducts);
productRouter.get('/get-all-activated-products-on-offer', verifyToken, verifyUser, productsController.getAllActivatedProductsOnOffer);
productRouter.get('/get-all-activated-products-on-flushsale', verifyToken, verifyUser, productsController.getAllActivatedProductsOnFlushsale);
productRouter.get('/get-all-products', verifyToken, verifyAdmin, productsController.getAllProducts);
productRouter.get('/get-single-activated-product/:ProductId', verifyToken, verifyUser, productsController.getSingleActivatedProduct);
