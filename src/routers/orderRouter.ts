import { Router } from "express";
import { orderController } from "../controllers/orderController";

export const orderRouter = Router();

orderRouter.post("/", orderController.createOrder); // Create a new order (Member)
orderRouter.get("/", orderController.findAll); // Get all orders (Baker, Member)
orderRouter.get("/:id", orderController.findById); // Find by Id (Baker, Member)
orderRouter.get("/baker/:id", orderController.findById); // Find baker orders (Baker)
orderRouter.put("/rate/:id", orderController.rateOrder); // Rate order by Id (Member)
orderRouter.put("/state/:id", orderController.updatedOrderSate); // Update order state (Baker)
