import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { Order, OrderState } from "../types";

export namespace orderController {
	export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Add date (day, month) to the collection time
			// TODO: Get bakerId from orderId internally
			// Collection time is a string "hour:minute"
			const order = req.body;
			const availableTime = await checkAvailability(order);
			// Create order
			if (availableTime) {
				const id = randomUUID();
				await db.createOrder({ id, ...order });
				return res.status(201).json({
					message: "Order created Successfully",
				});
			} else {
				throw new Error("Baker is not free at that time");
			}
		} catch (error: any) {
			next(new Error(error));
		}
	};
	const checkAvailability = async (order: any) => {
		// Get product duration
		const { duration } = await db.findProductById(order.productId); // In minutes
		// Get baker collection period
		const { collectionStart, collectionEnd } = await db.findBakerById(order.bakerId);
		// Get all baker orders where state is accepted
		const orders = await db.getBakerAcceptedOrders(order.bakerId);
		// Get duration of each order

		const [orderStart, orderEnd] = [
			orderPreparationStart(order.collectionTime, duration),
			order.collectionTime,
		];

		if (orders && orders.length) {
			const durations = await orders.map(async (order: any) => {
				const { duration } = await db.findProductById(order.productId);
				return duration;
			});

			const collisions = orders
				.map((order: any, i: number) => {
					const endTime = order.collectionTime;
					return [orderPreparationStart(endTime, durations[i]), endTime];
				})
				.filter((collision: any) => {
					// Eliminate collected orders before order start time
					if (compareTimeStamps(collision[1], orderStart) > -1) {
						return false;
						// Eliminate next orders after order collection time
					} else if (compareTimeStamps(orderEnd, collision[0])) {
						return false;
					} else {
						return true;
					}
				});
			if (collisions.length) {
				return false;
			}
		}

		// Validate order is within time range
		const inTimeRange =
			compareTimeStamps(collectionStart, orderStart) > -1 &&
			compareTimeStamps(orderEnd, collectionEnd) > -1;
		console.log({ inTimeRange });

		if (inTimeRange) {
			return true;
		} else {
			throw Error("Collection time is out of baker's time range");
		}
	};
	const orderPreparationStart = (timestamp: string, duration: number) => {
		// Split the input timestamp into hours and minutes
		const [hours, minutes] = timestamp.split(":").map(Number);

		// Convert the hours and minutes to total minutes
		const totalMinutes = hours * 60 + minutes;

		// Calculate the new total minutes by subtracting the duration
		const newTotalMinutes = totalMinutes - duration;

		// Ensure that the result is non-negative
		if (newTotalMinutes < 0) {
			throw new Error("Duration exceeds the provided timestamp.");
		}

		// Calculate the new hours and minutes
		const newHours = Math.floor(newTotalMinutes / 60);
		const newMinutes = newTotalMinutes % 60;

		// Format the new timestamp as "HH:MM"
		const newTimestamp = `${String(newHours).padStart(2, "0")}:${String(
			newMinutes
		).padStart(2, "0")}`;

		return newTimestamp;
	};
	function compareTimeStamps(timeStamp1: string, timeStamp2: string) {
		// Create a common date (e.g., today's date) for comparison
		const currentDate = new Date();

		// Parse time stamps into Date objects with the common date
		const date1 = new Date(currentDate.toDateString() + " " + timeStamp1);
		const date2 = new Date(currentDate.toDateString() + " " + timeStamp2);

		// Compare the Date objects
		if (date1 < date2) {
			return 1; // timeStamp1 is earlier than timeStamp2
		} else if (date1 > date2) {
			return -1; // timeStamp1 is later than timeStamp2
		} else {
			return 0; // timeStamp1 and timeStamp2 are the same
		}
	}

	export const findAll = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// TODO: Split baker and member order routes
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
			const newRating = (ratingSum / ratingValues.length).toFixed(1);
			await db.rateBaker(bakerId, newRating);
		} catch (error: any) {
			throw new Error(error);
		}
	};

	export const findBakerOrders = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			// TODO: Split baker and member order routes
			// TODO: Authorize by user id
			const id = req.params.id;
			if (!id) {
				return next(new Error("Please provide id"));
			}
			if (id !== res.locals.id) {
				throw new Error("Unauthorized action");
			}
			const orders = await db.getBakerOrders(id);
			return res.status(200).json({ data: orders });
		} catch (error: any) {
			next(new Error(error));
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
