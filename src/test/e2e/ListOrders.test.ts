import { afterEach, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import { Express } from "express";
import { WebServer } from "@/infra/Server";
import { DataSourceConnection } from "@/infra/DataSource";
import { MockInputOrder, MockInputUser } from "../constants";
import { config } from "dotenv";
import { AccountEntity } from "@/infra/repository/entity/Account.entity";
import { OrderEntity } from "@/infra/repository/entity/Order.entity";
import { Order } from "@/domain/entities/Order";
import { GeneralLogger } from "@/infra/log/GeneralLogger";
import { RabbitMQAdapter } from "@/infra/queue/RabbitMQAdapter";

config();

describe("/list_orders", () => {
	const logger = new GeneralLogger();
	const queue = new RabbitMQAdapter(logger);

	let app: Express;
	let webServer: WebServer;
	let dataSourceConnection: DataSourceConnection;

	const today = new Date().toISOString().substring(0, 10);
	const beforeToday = new Date(new Date().setDate(new Date().getDate() - 2));
	beforeToday.toISOString().substring(0, 10);

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

	test("should list orders successfully", async () => {
		const orderRepo = dataSourceConnection.getRepository(OrderEntity);
		const order = Order.register(new MockInputOrder(), new MockInputUser().id);
		await orderRepo.save(order);

		const response = await request(app)
			.get(`/list_orders?startDate=${today}&endDate=${today}`)
			.set("Accept", "application/json");

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(1);
		expect(response.body.name).not.toBeDefined();
	});

	test("should return OrderNotFoundBetweenDateRangeError response", async () => {
		const response = await request(app)
			.get(`/list_orders?startDate=${today}&endDate=${today}`)
			.set("Accept", "application/json");

		expect(response.status).toBe(400);
		expect(response.body.name).toBe("ORDER_NOT_FOUND_BETWEEN_DATE_RANGE");
		expect(response.body.message).toBeDefined();
	});

	test("should return InvalidDateRangeError response", async () => {
		const response = await request(app)
			.get(`/list_orders?startDate=${today}&endDate=${beforeToday}`)
			.set("Accept", "application/json");

		expect(response.status).toBe(400);
		expect(response.body.name).toBe("INVALID_DATE_RANGE");
	});
});
