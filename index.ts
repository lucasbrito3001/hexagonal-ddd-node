import "module-alias/register";
import { config } from "dotenv";
import { DataSourceConnection } from "./src/application/DataSource";
import { WebServer } from "./src/application/Server";

config();

const dataSourceConnection = new DataSourceConnection();

const webServer = new WebServer(dataSourceConnection);

["uncaughtException", "SIGINT", "SIGTERM"].forEach((signal) =>
	process.on(signal, (err) => {
		webServer.gracefulShutdown();
		process.exit(1);

	})
);

webServer.start();
