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

		return this;
	}

	// TODO: Create queries types and import them

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

	async findAllBakers(): Promise<Baker[]> {
		try {
			const query = "SELECT * FROM bakers";
			const bakers = await this.db.all(query);
			return bakers;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findBakerById(id: string): Promise<Baker | undefined> {
		try {
			const query = "SELECT * FROM baker WHERE id = ?";
			const baker: Baker | undefined = await this.db.get(query, id);
			return baker;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async bakerSignIn(email: string, password: string): Promise<string | undefined> {
		try {
			const query = "SELECT id FROM bakers WHERE email = ? AND password = ?";
			const bakerId: string | undefined = await this.db.get(query, [email, password]);
			return bakerId;
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

	async memberSignIn(email: string, password: string): Promise<string | undefined> {
		try {
			const query = "SELECT id FROM members WHERE email = ? AND password = ?";
			const memberId: string | undefined = await this.db.get(query, [email, password]);
			return memberId;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	// Product queries
	async createProduct(product: Product): Promise<void> {
		// TODO: Handle errors creating product
		try {
			const query = "INSERT INTO products (id, type, duration, bakerId) VALUES (?,?,?)";
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
			const products = await this.db.get(query);
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

	async updatedProductById(product: Omit<Product, "bakerId">): Promise<void> {
		try {
			const query = "UPDATE products SET type = ?, duration = ? WHERE id = ?";
			await this.db.run(query, [product.type, product.duration, product.id]);
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
				"INSERT INTO orders (id,memberId,bakerId,productId,payment,collectionTime) VALUES (?,?,?,?,?,?)";
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

	async findAllBakerOrders(bakerId: string): Promise<Order[]> {
		try {
			const query = "SELECT * FROM orders WHERE bakerId = ?";
			const orders = await this.db.all(query, bakerId);
			return orders;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findAllMemberOrders(memberId: string): Promise<Order[]> {
		try {
			const query = "SELECT * FROM orders WHERE memberId = ?";
			const orders = await this.db.all(query, memberId);
			return orders;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findBakerOrderById(id: string, bakerId: string): Promise<Order | undefined> {
		try {
			const query = "SELECT * FROM orders WHERE id = ?, bakerId = ?";
			const order = await this.db.get(query, [id, bakerId]);
			return order;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async findMemberOrderById(id: string, memberId: string): Promise<Order | undefined> {
		try {
			const query = "SELECT * FROM orders WHERE id = ?, memberId = ?";
			const order = await this.db.get(query, [id, memberId]);
			return order;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async updateOrderState(id: string, bakerId: string, state: string): Promise<void> {
		try {
			const query = "UPDATE orders SET state = ? WHERE id = ?, bakerId = ?";
			await this.db.run(query, [state, id, bakerId]);
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
