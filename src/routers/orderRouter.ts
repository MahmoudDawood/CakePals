import { Router } from "express";
import { orderController } from "../controllers/orderController";
import authenticate from "../middlewares/authenticate";
import { isBaker, isMember } from "../middlewares/authorize";

export const orderRouter = Router();

orderRouter.use(authenticate);
orderRouter.post("/", isMember, orderController.createOrder); // Create order ( Member)
orderRouter.get("/", orderController.findAll); // Get all orders (Baker, Member)
orderRouter.get("/:id", orderController.findById); // Find order by Id (Baker, Member)
orderRouter.get("/baker/:id", isBaker, orderController.findBakerOrders); // Find baker orders (Baker)
orderRouter.put("/rate/:id", isMember, orderController.rateOrder); // Rate order by Id (Member)
orderRouter.put("/state/:id", isBaker, orderController.updatedOrderSate); // Update order state (Baker)
