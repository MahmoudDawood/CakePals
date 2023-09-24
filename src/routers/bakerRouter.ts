import { Router } from "express";
import { bakerController } from "../controllers/bakerController";

export const bakerRouter = Router();

bakerRouter.post("/signup", bakerController.signup); // Signup
bakerRouter.post("/login", bakerController.login); // Login
bakerRouter.get("/available/:id"); // TODO: Find baker available collection hours per product duration
bakerRouter.get("/", bakerController.findAll); // Find all
bakerRouter.get("/:id", bakerController.findById); // Find by id
