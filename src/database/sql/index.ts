import path from "path";
import { Database, open as sqliteOpen } from "sqlite";
import sqlite3 from "sqlite3";
import { Baker, Member, Order, Product } from "../../types";

export class SqlDataStore {
	private db!: Database<sqlite3.Database, sqlite3.Statement>;
	public async openDb() {
		this.db = await sqliteOpen({
			filename: path.join(__dirname, "cakepals.sqlite"),
			driver: sqlite3.Database,
		});

		await this.db.migrate({
			migrationsPath: path.join(__dirname, "migrations"),
		});
		await this.db.exec("PRAGMA foreign_keys = ON;");

		return this;
	}

	// Queries

	// TODO: Refactor each entity queries to it's own file

	// Baker queries
	async createBaker(baker: Baker): Promise<void> {
		// TODO: Check if email already exists for error message
		try {
			await this.db.run(
				"INSERT INTO bakers (id, firstName, lastName, email, password, collectionStart, collectionEnd, latitude, longitude) VALUES (?,?,?,?,?,?,?,?,?)",
				[
					baker.id,
					baker.firstName,
					baker.lastName,
					baker.email,
					baker.password,
					baker.collectionStart,
					baker.collectionEnd,
					baker.latitude,
					baker.longitude,
				]
			);
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async bakerSignIn({ email }: Pick<Baker, "email">): Promise<string | undefined> {
		try {
			const query = "SELECT id, password FROM bakers WHERE email = ?";
			const password: string | undefined = await this.db.get(query, email);
			console.log(password);
			return password;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findAllBakers(): Promise<Omit<Baker, "id">[]> {
		try {
			// TODO: Include owned products by this baker
			const query =
				"SELECT firstName, lastName, rating, collectionStart, collectionEnd, latitude, longitude FROM bakers";
			const bakers = await this.db.all(query);
			return bakers;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findBakerById(id: string): Promise<Baker | undefined> {
		try {
			const query =
				"SELECT firstName, lastName, rating, collectionStart, collectionEnd, latitude, longitude FROM bakers WHERE id = ?";
			const baker: Baker | undefined = await this.db.get(query, id);
			return baker;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	// Member queries
	async createMember(member: Member): Promise<void> {
		// TODO: Check if email already exists for error message
		try {
			await this.db.run(
				"INSERT INTO members (id, firstName, lastName, email, password, latitude, longitude) VALUES (?,?,?,?,?,?,?)",
				[
					member.id,
					member.firstName,
					member.lastName,
					member.email,
					member.password,
					member.latitude,
					member.longitude,
				]
			);
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async memberSignIn({ email }: Pick<Member, "email">): Promise<string | undefined> {
		try {
			const query = "SELECT id, password FROM members WHERE email = ?";
			const result = await this.db.get(query, email);
			return result;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findMemberLocationById(id: string): Promise<Member | undefined> {
		try {
			const query = "SELECT latitude, longitude FROM bakers WHERE id = ?";
			const member: Baker | undefined = await this.db.get(query, id);
			return member;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	// Product queries
	async createProduct(product: Product): Promise<void> {
		// TODO: Handle errors creating product
		try {
			const query = "INSERT INTO products (id, type, duration, bakerId) VALUES (?,?,?,?)";
			await this.db.run(query, [
				product.id,
				product.type,
				product.duration,
				product.bakerId,
			]);
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findAllProducts(): Promise<Product[]> {
		try {
			const query = "SELECT * FROM products";
			const products = await this.db.all(query);
			return products;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findProductById(id: string): Promise<Product | undefined> {
		try {
			const query = "SELECT * FROM products WHERE id = ?";
			const product = await this.db.get(query, id);
			return product;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async updateProductById(product: Product): Promise<void> {
		try {
			const query =
				"UPDATE products SET type = ?, duration = ? WHERE id = ? AND bakerId = ?";
			await this.db.run(query, [
				product.type,
				product.duration,
				product.id,
				product.bakerId,
			]);
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async deleteProductById(id: string): Promise<Product | undefined> {
		try {
			const query = "DELETE FROM products WHERE id = ?";
			const product = await this.db.get(query, id);
			return product;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	// Order queries

	async createOrder(order: Order): Promise<void> {
		try {
			const query =
				"INSERT INTO orders (id, memberId, bakerId, productId, payment, collectionTime) VALUES (?,?,?,?,?,?);";
			await this.db.run(query, [
				order.id,
				order.memberId,
				order.bakerId,
				order.productId,
				order.payment,
				order.collectionTime,
			]);
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findAllOrders(): Promise<Order[]> {
		try {
			const query = "SELECT * FROM orders"; // WHERE bakerId = ? OR memberId = ?";
			const orders = await this.db.all(query);
			return orders;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findOrderById(id: string): Promise<Order | undefined> {
		try {
			const query = "SELECT * FROM orders WHERE id = ?";
			const order = await this.db.get(query, id);
			return order;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async rateOrder({ id, rating }: Pick<Order, "id" | "rating">): Promise<void> {
		try {
			console.log({ id, rating });
			const query = "UPDATE orders SET rating = ? WHERE id = ? AND state = 'fulfilled'";
			await this.db.run(query, [rating, id]);
			console.log("Query ran successfully");
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async getOrderBaker(orderId: string): Promise<string> {
		try {
			const query = "SELECT bakerId FROM orders WHERE id = ?";
			const bakerId = await this.db.get(query, orderId);
			return bakerId;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async getBakerRatings(bakerId: string): Promise<number[]> {
		try {
			// Get all bakers' ratings for fulfilled orders
			const query =
				"SELECT rating FROM orders WHERE bakerId = ? AND state = 'fulfilled' AND rating IS NOT NULL";
			const ratings = await this.db.all(query, bakerId);
			return ratings;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async rateBaker(bakerId: string, newRating: number): Promise<void> {
		try {
			const query = "UPDATE bakers SET rating = ? WHERE id = ?";
			await this.db.run(query, [newRating, bakerId]);
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async updateOrderState({ id, state }: Pick<Order, "id" | "state">): Promise<void> {
		try {
			const query = "UPDATE orders SET state = ? WHERE id = ?";
			await this.db.run(query, [state, id]);
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async getBakerAcceptedOrders(bakerId: string): Promise<Order[]> {
		try {
			const query = "SELECT * FROM orders WHERE bakerId = ? AND state = 'accepted'";
			const orders = await this.db.all(query, bakerId);
			return orders;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async getBakerOrders(bakerId: string): Promise<Order[]> {
		try {
			const query = "SELECT * FROM orders WHERE bakerId = ?";
			const orders = await this.db.all(query, bakerId);
			return orders;
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
