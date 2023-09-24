import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { Product } from "../types";
import { calculateDistance } from "../utils/calculateDistance";

export namespace productController {
	export const createProduct = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			// Duration in minutes
			const { type, duration, bakerId } = req.body;
			if (bakerId !== res.locals.id) {
				return new Error("Use your correct baker id");
			}
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

	export const findByLocationType = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const searchType = req.query.type as string;
			let { latitude, longitude, distance } = req.body;
			if (!latitude || !longitude) {
				throw new Error(
					"Please provide coordinates (latitude, longitude) in request body"
				);
			}
			// Get all products
			const products = await db.findAllProducts();
			// Filter them to match type input
			const productsByType = products.filter((product: any) => {
				if (searchType) {
					return product.type.toLowerCase().includes(searchType.toLowerCase());
				}
				return true;
			});
			// Find each product baker location
			const filteredProducts: any[] = [];
			for (const product of productsByType) {
				const bakerId = product.bakerId;
				const baker = await db.findBakerById(bakerId);
				// Calculate distance to filter (in meter)
				const actualDistance =
					calculateDistance(latitude, longitude, baker.latitude, baker.longitude) / 1000;
				if (actualDistance < distance) {
					filteredProducts.push(product);
				}
			}

			return res.status(200).json({ data: filteredProducts });
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
			const bakerId = res.locals.id;
			await db.updateProductById({ id, type, duration, bakerId });
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
