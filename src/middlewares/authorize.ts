import { NextFunction, Request, Response } from "express";

export const isBaker = (req: Request, res: Response, next: NextFunction) => {
	try {
		const role = res.locals.role;
		if (role == "baker") {
			next();
		}
		return res.status(403).send("Unauthorized Access");
	} catch (error: any) {
		throw new Error(error);
	}
};

export const isMember = (req: Request, res: Response, next: NextFunction) => {
	try {
		const role = res.locals.role;
		if (role == "member") {
			next();
		}
		return res.status(403).send("Unauthorized Access");
	} catch (error: any) {
		throw new Error(error);
	}
};
