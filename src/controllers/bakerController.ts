import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { Baker } from "../types";

export namespace bakerController {
	export const signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Create a JWT and return it in the response
			// TODO: Hash password before storing it
			const baker: Baker = req.body;
			baker.id = randomUUID();
			await db.createBaker(baker);
			return res.status(200).json({
				message: "Baker Signed Up Successfully",
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Create a JWT and return it in the response
			// TODO: Hash password before querying it
			const { email, password } = req.body;
			const data = await db.bakerSignIn({ email, password });
			if (data) {
				return res.status(201).json({
					message: "Baker Signed in Successfully",
					data,
				});
			} else {
				throw new Error("Wrong login entry");
			}
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const findAll = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const bakers = await db.findAllBakers();
			return res.status(200).json({ data: bakers });
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const findById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = req.params.id;
			if (!id) {
				return next(new Error("Please provide User id"));
			}
			const baker = await db.findBakerById(id);
			return res.status(200).json({ data: baker });
		} catch (error: any) {
			next(new Error(error));
		}
	};
}
