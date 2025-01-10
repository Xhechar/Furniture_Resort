import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verification.tokens";
import { ProductService } from "../services/products.service";
import { ProductSchema } from "../validators/backend.input.validators";

const productService = new ProductService();

export class ProductsController {
  async createProduct(req: ExtendedRequest, res: Response) {
    try {

      let { error } = ProductSchema.validate(req.body);

      if (error) return res.status(401).json({ error: error.message });

      let result = await productService.createProduct(getIdFromToken(req), req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async updateProduct(req: ExtendedRequest, res: Response) {
    try {
      let { error } = ProductSchema.validate(req.body);

      if (error) return res.status(401).json({ error: error.message });

      let result = await productService.updateProduct(getIdFromToken(req), req.params.ProductId, req.body);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleActivationStatus(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleActivationStatus(getIdFromToken(req), req.params.ProductId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleActivationOfMultipleProducts(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleActivationOfMultipleProducts(getIdFromToken(req), req.body.ProductIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleOnOffer(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleOnOffer(getIdFromToken(req), req.params.ProductId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleOnOfferOfMultipleProducts(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleOnOfferOfMultipleProducts(getIdFromToken(req), req.body.ProductIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleFlushSaleProduct(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleFlushSaleProduct(getIdFromToken(req), req.params.ProductId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleMultipleFlushSaleProducts(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleMultipleFlushSaleProducts(getIdFromToken(req), req.body.ProductIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async automateFlashSaleProducts(res: Response) {
    try {
      
      let result = await productService.automateFlashSaleProducts();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleCustomisationOfSingleProduct(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleCustomisationOfSingleProduct(getIdFromToken(req), req.params.ProductId);

      return res.status(201).json(result);

    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async toggleMultipleCustomisationOfProducts(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.toggleMultipleCustomisationOfProducts(getIdFromToken(req), req.body.ProductIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async deleteMultipleProducts(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.deleteMultipleProducts(getIdFromToken(req), req.body.ProductIds);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async deleteSingleProduct(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.deleteSingleProduct(getIdFromToken(req), req.params.ProductId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllActivatedProducts(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.getAllActivatedProducts();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllActivatedProductsOnOffer(req: ExtendedRequest, res: Response) {
    try {

      let result = await productService.getAllActivatedProductsOnOffer();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllActivatedProductsOnFlushsale(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.getAllActivatedProductsOnFlushsale();

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getAllProducts(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.getAllProducts(getIdFromToken(req));

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }
  async getSingleActivatedProduct(req: ExtendedRequest, res: Response) {
    try {
      
      let result = await productService.getSingleActivatedProduct(getIdFromToken(req), req.params.ProductId);

      return res.status(201).json(result);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }

}