import express from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { ErrorBase, ErrorsData } from "@/resources/ErrorBase";

type WebServerErrorNames = "WEB_SERVER_CLOSED";

export const WEB_SERVER_ERRORS: ErrorsData<WebServerErrorNames> = {
	WEB_SERVER_CLOSED: {
		message: "Can't close the web server, it's already closed.",
	},
};

export class WebServerError extends ErrorBase<WebServerErrorNames> {
	constructor(errorName: WebServerErrorNames) {
		super(errorName, WEB_SERVER_ERRORS[errorName].message);
	}
}

export class WebServer {
	private application: Server | undefined;

	constructor(private dataSourceConnection: DataSourceConnection) {}

	async start() {
		await this.dataSourceConnection.initialize();

		const app = express();

		app.get("/healthy", (req, res) => {
			res.send("Hello world!");
		});

		this.application = app.listen(process.env.PORT, () => {
			console.log("Server started, listening on port " + process.env.PORT);
		});
	}

	gracefulShutdown() {
		if (!this.application) throw new WebServerError("WEB_SERVER_CLOSED");

		this.application.close();
	}
}
