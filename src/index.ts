import "reflect-metadata";

import "module-alias/register";
import { config } from "dotenv";
import { DataSourceConnection } from "./infra/DataSource";
import { WebServer } from "./infra/Server";
import multer from "multer";

config();

const dataSourceConnection = new DataSourceConnection();

const webServer = new WebServer(dataSourceConnection);

["uncaughtException", "SIGINT", "SIGTERM"].forEach((signal) =>
	process.on(signal, (err) => {
		console.log(err);
		webServer.gracefulShutdown();
		process.exit(1);
	})
);

webServer.start();
