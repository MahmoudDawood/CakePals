import { Router } from "express";

export const productRouter = Router()

productRouter.post("/") // Create a new product (Baker)
productRouter.get("/")  // Find all
productRouter.get("/:id")  // Find by id
productRouter.get("/search")  // Find by location & type
productRouter.put("/:id")  // Edit product (Baker)
productRouter.delete("/:id")  // Delete by id (Baker)

