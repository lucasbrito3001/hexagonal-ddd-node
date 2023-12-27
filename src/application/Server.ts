import express, { Express } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { ErrorBase, ErrorsData } from "@/resources/ErrorBase";
import { BookRouter } from "./router/BookRouter";
import multer, { Multer } from "multer";
import { Book } from "@/resources/book/domain/Book";
import { CONFIG_ROUTERS } from "./router";

type WebServerErrorNames = "WEB_SERVER_CLOSED";

export const WEB_SERVER_ERRORS: ErrorsData<WebServerErrorNames> = {
	WEB_SERVER_CLOSED: {
		message: "Can't close the web server, it's already closed.",
		httpCode: 0,
	},
};

export class WebServerError extends ErrorBase<WebServerErrorNames> {
	constructor(errorName: WebServerErrorNames) {
		super(
			errorName,
			WEB_SERVER_ERRORS[errorName].message,
			WEB_SERVER_ERRORS[errorName].httpCode
		);
	}
}

export class WebServer {
	private application: Server | undefined;
	private uploader: Multer;

	constructor(private dataSourceConnection: DataSourceConnection) {
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, "/tmp/uploads");
			},
			filename: function (req, file, cb) {
				const { title, edition } = req.body;
				const filename = Book.coverFilename(title, edition, "jpg");
				req.body.cover = filename;
				cb(null, filename);
			},
		});
		this.uploader = multer({ storage });
	}

	async start() {
		await this.dataSourceConnection.initialize();

		const app = express();

		app.use(express.json());

		this.setRoutes(app);

		this.application = app.listen(process.env.PORT, () => {
			console.log("Server started, listening on port " + process.env.PORT);
		});
	}

	private setRoutes(app: Express) {
		CONFIG_ROUTERS.forEach((config_router) => {
			const routes = express.Router();

			new config_router.router(
				routes,
				this.dataSourceConnection,
				this.uploader
			).expose();

			app.use(config_router.prefix, routes);
		});

		app.get("/healthy", (req, res) => {
			res.send("Hello world!");
		});
	}

	gracefulShutdown() {
		if (!this.application) throw new WebServerError("WEB_SERVER_CLOSED");

		this.application.close();
	}
}
