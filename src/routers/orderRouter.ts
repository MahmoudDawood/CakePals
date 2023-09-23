import { Router } from "express";

export const orderRouter = Router();

orderRouter.post("/"); // Create a new order (Member)
orderRouter.get("/"); // Get all orders (Baker, Member)
orderRouter.get("/:id"); // Find by Id (Baker, Member)
orderRouter.put("/:id"); // Update order state (Baker)
orderRouter.put("/rate/:id"); // Update order state (Baker)
