import { Router } from "express";

export const memberRouter = Router()

memberRouter.post("/signup") // Create a new member
memberRouter.post("/login") // Login as a member
memberRouter.post("/:id")  // Rate order by id
