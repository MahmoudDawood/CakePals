import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { Order, OrderState } from "../types";

export namespace orderController {
	export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Collection time is a string "hour:minute"
			const order = req.body;
			const id = randomUUID();
			await db.createOrder({ id, ...order });
			return res.status(201).json({
				message: "Order created Successfully",
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const findAll = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Split baker and member order routes
			// TODO: Authorize orders by user id
			// const id = req.params.id;
			const orders = await db.findAllOrders();
			return res.status(200).json({ data: orders });
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const findById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Split baker and member order routes
			// TODO: Authorize by user id
			const id = req.params.id;
			if (!id) {
				return next(new Error("Please provide id"));
			}
			const order = await db.findOrderById(id);
			return res.status(200).json({ data: order });
		} catch (error: any) {
			next(new Error(error));
		}
	};

	export const rateOrder = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Split baker and member order routes
			// TODO: Authorize by user id
			// TODO: Validate order is fulfilled sending response
			const id = req.params.id;
			const rating = req.body.rating;
			if (!id) {
				return next(new Error("Please provide id"));
			}
			await db.rateOrder({ id, rating });
			console.log("Updating bakers' rating");
			await rateBaker(id);

			return res.status(201).json({ message: "Order and baker rated successfully" });
		} catch (error: any) {
			next(new Error(error));
		}
	};
	const rateBaker = async (orderId: string) => {
		try {
			const { bakerId } = await db.getOrderBaker(orderId);
			const ratings = await db.getBakerRatings(bakerId);
			if (!ratings.length) {
				return new Error("No fulfilled orders yet");
			}
			const ratingValues = ratings.map((entry: any) => entry["rating"]);
			const ratingSum = ratingValues.reduce((acc: number, curr: number) => acc + curr);
			const newRating = Math.floor(ratingSum / ratingValues.length);
			await db.rateBaker(bakerId, newRating);
		} catch (error: any) {
			throw new Error(error);
		}
	};

	export const updatedOrderSate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			// TODO: Allow members to update order state
			// TODO: Validate id exists before updating
			// TODO: Create FSM (Finite state machine) for order states
			// (pending => (accepted => fulfilled#, rejected#))
			const state = req.body.state;
			if (state !== "rejected" && state !== "accepted" && state !== "fulfilled") {
				return next(new Error("Please provide a valid state"));
			}
			const id = req.params.id;
			if (!id) {
				return next(new Error("Please provide id"));
			}
			await db.updateOrderState({ id, state });
			return res.status(201).json({
				message: "Order state updated successfully",
			});
		} catch (error: any) {
			next(new Error(error));
		}
	};
}
