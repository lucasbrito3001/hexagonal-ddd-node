import { afterEach, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import { Express } from "express";
import { WebServer } from "@/infra/Server";
import { DataSourceConnection } from "@/infra/DataSource";
import {
	MockInputConfirmOrderItemReception,
	MockInputUser,
} from "../constants";
import { config } from "dotenv";
import { AccountEntity } from "@/infra/repository/entity/Account.entity";

import { GeneralLogger } from "@/infra/log/GeneralLogger";
import { RabbitMQAdapter } from "@/infra/queue/RabbitMQAdapter";

config();

describe("/confirm_order_item_reception", () => {
	const logger = new GeneralLogger();
	const queue = new RabbitMQAdapter(logger);

	let app: Express;
	let webServer: WebServer;
	let dataSourceConnection: DataSourceConnection;

	beforeEach(async () => {
		dataSourceConnection = new DataSourceConnection();
		webServer = new WebServer(dataSourceConnection, queue, logger);

		app = (await webServer.start(true)) as Express;

		const userRepo = dataSourceConnection.getRepository(AccountEntity);
		await userRepo.save(new MockInputUser());
	});

	afterEach(() => {
		dataSourceConnection.close();
	});

	test("should return InvalidInputError when sending invalid body", async () => {
		const response = await request(app)
			.put("/confirm_order_item_reception")
			.send({})
			.set("Accept", "application/json");

		expect(response.status).toBe(400);
		expect(response.body.name).toBe("INVALID_INPUT");
	});

	test("should return OrderItemNotFoundError when try to receive an order from another owner", async () => {
		const response = await request(app)
			.put("/confirm_order_item_reception")
			.send(new MockInputConfirmOrderItemReception())
			.set("Accept", "application/json");

		expect(response.status).toBe(400);
		expect(response.body.name).toBe("ORDER_ITEM_NOT_FOUND");
	});

	test("should return ForbiddenActionError when try to receive an order from another owner", async () => {
		const response = await request(app)
			.put("/confirm_order_item_reception")
			.send(new MockInputConfirmOrderItemReception())
			.set("Accept", "application/json");

		expect(response.status).toBe(403);
		expect(response.body.name).toBe("FORBIDDEN_ACTION");
	});

	test("should confirm the order item reception successfully", async () => {
		const response = await request(app)
			.put("/confirm_order_item_reception")
			.send(new MockInputConfirmOrderItemReception())
			.set("Accept", "application/json");

		expect(response.status).toBe(200);
	});
});
