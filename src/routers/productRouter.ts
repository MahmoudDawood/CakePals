import { Router } from "express";
import { productController } from "../controllers/productController";

export const productRouter = Router();

productRouter.post("/", productController.createProduct); // Create a new product (Baker)
productRouter.get("/search", productController.findByLocationType); // Find by location & type
productRouter.get("/", productController.findAll); // Find all
productRouter.get("/:id", productController.findById); // Find by id
productRouter.put("/:id", productController.updatedProductById); // Edit product (Baker)
productRouter.delete("/:id", productController.deleteProductById); // Delete by id (Baker)
