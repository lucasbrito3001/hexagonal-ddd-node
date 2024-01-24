import { afterEach, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import { Express } from "express";
import { WebServer } from "@/infra/Server";
import { DataSourceConnection } from "@/infra/DataSource";
import { INPUT_ORDER, INPUT_USER } from "../constants";
import { config } from "dotenv";
import { UserEntity } from "@/infra/repository/entity/User.entity";
import { RabbitMQAdapter } from "@/infra/queue/RabbitMQAdapter";
import { GeneralLogger } from "@/infra/log/GeneralLogger";

config();

describe("/register_order", () => {
	const logger = new GeneralLogger();
	const queue = new RabbitMQAdapter(logger);
	
	let dataSourceConnection: DataSourceConnection;
	let webServer: WebServer;
	let app: Express;

	beforeEach(async () => {
		dataSourceConnection = new DataSourceConnection();

		webServer = new WebServer(dataSourceConnection, queue, logger);

		app = (await webServer.start(true)) as Express;

		const userRepo = dataSourceConnection.getRepository(UserEntity);
		await userRepo.save(INPUT_USER);
	});

	afterEach(() => {
		dataSourceConnection.close();
	});

	test("should register a new order successfully", async () => {
		const response = await request(app)
			.post("/register_order")
			.send(INPUT_ORDER)
			.set("Accept", "application/json");

		expect(response.status).toBe(201);
		expect(response.body.orderId).toBeDefined();
	});

	test("should return a InvalidOrderInputError response", async () => {
		const response = await request(app)
			.post("/register_order")
			.send({})
			.set("Accept", "application/json");

		expect(response.status).toBe(400);
		expect(response.body.name).toBe("INVALID_INPUT");
		expect(response.body.cause).toBeDefined();
		expect(response.body.message).toBeDefined();
	});
});
