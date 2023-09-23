import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { Member } from "../types";

export namespace memberController {
	export const signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Create a JWT and return it in the response
			// TODO: Hash password before storing it
			const member: Member = req.body;
			member.id = randomUUID();
			await db.createMember(member);
			return res.status(200).json({
				message: "Member Signed Up Successfully",
				data: { id: member.id },
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
			const { id } = await db.memberSignIn({ email, password });
			if (id) {
				return res.status(201).json({
					message: "Member Signed in Successfully",
					data: { id, role: "member" },
				});
			} else {
				throw new Error("Wrong login data");
			}
		} catch (error: any) {
			next(new Error(error));
		}
	};
}
