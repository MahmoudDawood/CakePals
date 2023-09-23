import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { Product } from "../types";

export namespace productController {
	export const createProduct = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			// Duration in minutes
			const { type, duration, bakerId } = req.body;
			const id = randomUUID();
			await db.createProduct({ id, type, duration, bakerId });
			return res.status(201).json({
				message: "Product created Successfully",
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const findAll = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const products = await db.findAllProducts();
			return res.status(200).json({ data: products });
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
			const product = await db.findProductById(id);
			return res.status(200).json({ data: product });
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const updatedProductById = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { type, duration } = req.body;
			const id = req.params.id;
			if (!id) {
				return next(new Error("Please provide id"));
			}
			await db.updatedProductById({ id, type, duration });
			return res.status(201).json({
				message: "Product updated successfully",
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const deleteProductById = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const id = req.params.id;
			if (!id) {
				return next(new Error("Please provide id"));
			}
			await db.deleteProductById(id);
			return res.status(204).json({
				message: "Product deleted successfully",
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};
}
