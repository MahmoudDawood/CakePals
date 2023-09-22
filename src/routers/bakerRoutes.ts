import { Router } from "express";

export const bakerRouter = Router()

bakerRouter.post("/signup") // Signup
bakerRouter.post("/login")  // Login
bakerRouter.get("/")  // Find all
bakerRouter.get("/:id")  // Find by id

