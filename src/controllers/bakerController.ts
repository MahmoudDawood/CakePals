import bcrypt, { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database";
import { Baker } from "../types";

const pepper = process.env.BCRYPT_PEPPER;
const salt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.TOKEN_SECRET || "1";
const COOKIE_MAX_AGE = 2 * 24 * 60 * 60 * 1000;
const expiresIn = "2 days";

export namespace bakerController {
	export const signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const baker: Baker = req.body;
			const pepperPassword = baker.password + pepper;
			const hashedPassword = bcrypt.hashSync(pepperPassword, salt);
			baker.password = hashedPassword;
			baker.id = randomUUID();
			await db.createBaker(baker);

			// TODO: Refactor hashing password and signing JWT to separate middleware
			const payload = { id: baker.id, role: "baker" };
			const token = jwt.sign(payload, tokenSecret, { expiresIn });
			res.cookie("jwt", token, {
				httpOnly: true,
				maxAge: COOKIE_MAX_AGE as number,
			});
			return res.status(201).json({
				message: "Baker created successfully",
				data: { token },
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			let { email, password } = req.body;
			const result = await db.bakerSignIn({ email });

			if (result.password) {
				const pepperPassword = password + pepper;
				const passwordMatch = bcrypt.compareSync(pepperPassword, result.password);
				if (!passwordMatch) {
					throw new Error("Either username or password are wrong");
				}
				const payload = { id: result.id, role: "baker" };
				const token = jwt.sign(payload, tokenSecret, { expiresIn });
				res.cookie("jwt", token, {
					httpOnly: true,
					maxAge: COOKIE_MAX_AGE as number,
				});
				return res.status(201).json({
					message: "Baker Signed in Successfully",
					data: { token },
				});
			} else {
				throw new Error("Wrong login data");
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
				return next(new Error("Please provide id"));
			}
			const baker = await db.findBakerById(id);
			return res.status(200).json({ data: baker });
		} catch (error: any) {
			next(new Error(error));
		}
	};
}
