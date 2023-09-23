import path from "path";
import { open as sqliteOpen } from "sqlite";
import sqlite3 from "sqlite3";

export let db: any;

class SqlDataStore {
	public async openDb() {
		const db = await sqliteOpen({
			filename: path.join(__dirname, "cakepals.sqlite"),
			driver: sqlite3.Database,
		});

		await db.migrate({
			migrationsPath: path.join(__dirname, "migrations"),
		});

		return this;
	}
}

export async function initDb() {
	db = await new SqlDataStore().openDb();
}
