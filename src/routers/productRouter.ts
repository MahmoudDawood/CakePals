import { Router } from "express";
import { productController } from "../controllers/productController";
import authenticate from "../middlewares/authenticate";
import { isBaker } from "../middlewares/authorize";

export const productRouter = Router();

productRouter.post("/", authenticate, isBaker, productController.createProduct); // Create a new product (Baker)
productRouter.get("/search", productController.findByLocationType); // Find by location & type
productRouter.get("/", productController.findAll); // Find all
productRouter.get("/:id", productController.findById); // Find by id
productRouter.put("/:id", authenticate, isBaker, productController.updatedProductById); // Edit product (Baker)
productRouter.delete("/:id", authenticate, isBaker, productController.deleteProductById); // Delete by id (Baker)
