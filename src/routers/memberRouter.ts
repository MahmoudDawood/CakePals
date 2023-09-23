import { Router } from "express";
import { memberController } from "../controllers/memberController";

export const memberRouter = Router();

memberRouter.post("/signup", memberController.signup); // Create a new member
memberRouter.post("/login", memberController.login); // Login as a member
