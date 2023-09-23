import express, { Express } from "express";
import asyncHandler from "express-async-handler";
import helmet from "helmet";
import morgan from "morgan";
import { initDb } from "./database";
require("dotenv").config();

(async () => {
	await initDb();

	const app: Express = express();
	const port = process.env.PORT ?? 3000;

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(morgan("dev"));
	app.use(helmet());

	app.get("/", (req, res) => {
		res.send("Hello world");
	});

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
})();
