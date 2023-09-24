import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
dotenv.config();

export default function (req: Request, res: Response, next: NextFunction) {
	try {
		const authorizationHeader = req.headers.authorization;
		const token = authorizationHeader?.split(" ")[1];
		if (!token) {
			return res.status(401).send("Access Denied / Unauthorized request");
		}
		const payload = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
		res.locals.id = payload.id;
		res.locals.role = payload.role;
		next();
	} catch (error: any) {
		return res.status(401).json("Access denied, Invalid token: " + error);
	}
}
