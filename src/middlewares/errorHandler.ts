import { NextFunction, Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	const statusCode = err.statusCode || 500;
	if (!err.message) {
		err.message = "Something went wrong!";
	}
	if (err.name === "Validation Error") {
		return res.status(400).json({
			message: err.message,
			// stack: err.stack,
		});
	}
	return res.status(statusCode).json({
		message: err.message,
		// stack: err.stack,
	});
};

export default errorHandler;
