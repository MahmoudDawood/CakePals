import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database";
import { Member } from "../types";

const pepper = process.env.BCRYPT_PEPPER;
const salt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.TOKEN_SECRET || "1";
const COOKIE_MAX_AGE = 2 * 24 * 60 * 60 * 1000;
const expiresIn = "2 days";

export namespace memberController {
	export const signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const member: Member = req.body;
			const pepperPassword = member.password + pepper;
			const hashedPassword = bcrypt.hashSync(pepperPassword, salt);
			member.password = hashedPassword;
			member.id = randomUUID();
			await db.createMember(member);

			const payload = { id: member.id, role: "member" };
			const token = jwt.sign(payload, tokenSecret, { expiresIn });
			res.cookie("jwt", token, {
				httpOnly: true,
				maxAge: COOKIE_MAX_AGE as number,
			});
			return res.status(200).json({
				message: "Member Signed Up Successfully",
				data: { token },
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const login = async (req: Request, res: Response, next: NextFunction) => {
		let { email, password } = req.body;
		try {
			const result = await db.memberSignIn({ email });
			if (result.password) {
				const pepperPassword = password + pepper;
				const passwordMatch = bcrypt.compareSync(pepperPassword, result.password);
				if (!passwordMatch) {
					throw new Error("Either username or password are wrong");
				}
				const payload = { id: result.id, role: "member" };
				const token = jwt.sign(payload, tokenSecret, { expiresIn });
				res.cookie("jwt", token, {
					httpOnly: true,
					maxAge: COOKIE_MAX_AGE as number,
				});
				return res.status(201).json({
					message: "Member Signed in Successfully",
					data: { token },
				});
			} else {
				throw new Error("Wrong login data");
			}
		} catch (error: any) {
			next(new Error(error));
		}
	};
}
