import express, { Express } from "express";
// import asyncHandler from "express-async-handler";
import helmet from "helmet";
import morgan from "morgan";
import { initDb } from "./database";
import errorHandler from "./middlewares/errorHandler";
import { bakerRouter, memberRouter, orderRouter, productRouter } from "./routers/";
require("dotenv").config();

(async () => {
	await initDb();

	const app: Express = express();
	const port = process.env.PORT ?? 3000;

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(morgan("dev"));
	app.use(helmet());

	app.use("/bakers", bakerRouter);
	app.use("/members", memberRouter);
	app.use("/products", productRouter);
	app.use("/orders", orderRouter);

	app.get("/", (req, res) => {
		res.send("Hello world");
	});

	app.use(errorHandler);

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
})();
