import { SqlDataStore } from "./sql";

export let db: any;

export async function initDb() {
	db = await new SqlDataStore().openDb();
}
