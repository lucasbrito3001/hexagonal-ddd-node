import "reflect-metadata";
import "module-alias/register";

import { config } from "dotenv";
import { DataSourceConnection } from "./infra/DataSource";
import { WebServer } from "./infra/Server";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { GeneralLogger } from "./infra/log/GeneralLogger";
import { MissingEnvVariableError } from "./error/InfraError";

config();

const logger = new GeneralLogger();

const dataSourceConnection = new DataSourceConnection();
const queueAdapter = new RabbitMQAdapter(logger);

const webServer = new WebServer(dataSourceConnection, queueAdapter, logger);

["uncaughtException", "SIGINT", "SIGTERM"].forEach((signal) =>
	process.on(signal, (err) => {
		console.log(`[${signal.toUpperCase()}]: ${JSON.stringify(err)}`);
		webServer.gracefulShutdown();
		process.exit(1);
	})
);

if (!process.env.JWT_SECRET) throw new MissingEnvVariableError("JWT_SECRET");

webServer.start(false);
