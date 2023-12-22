import { Express } from "express";
import { DataSourceConnection, DataSourceError } from "./DataSource";

export class WebServer {
	public webServer: Express | undefined;

	constructor(private dataSourceConnection: DataSourceConnection) {}

	async start() {
		await this.dataSourceConnection.initialize();
	}

	stop() {}
}
