import { afterEach, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import { Express } from "express";
import { WebServer } from "@/infra/Server";
import { DataSourceConnection } from "@/infra/DataSource";
import { INPUT_ORDER, INPUT_USER } from "../constants";
import { config } from "dotenv";
import { UserEntity } from "@/infra/repository/entity/User.entity";
import { OrderEntity } from "@/infra/repository/entity/Order.entity";
import { Order } from "@/domain/entities/Order";

config();

describe("/list_orders", () => {
	let app: Express;
	let webServer: WebServer;
	let dataSourceConnection: DataSourceConnection;

	const today = new Date().toISOString().substring(0, 10);
	const beforeToday = new Date(new Date().setDate(new Date().getDate() - 2));
	beforeToday.toISOString().substring(0, 10);

	beforeEach(async () => {
		dataSourceConnection = new DataSourceConnection();
		webServer = new WebServer(dataSourceConnection);

		app = (await webServer.start(true)) as Express;

		const userRepo = dataSourceConnection.getRepository(UserEntity);
		await userRepo.save(INPUT_USER);
	});

	afterEach(() => {
		dataSourceConnection.close();
	});

	test("should list orders successfully", async () => {
		const orderRepo = dataSourceConnection.getRepository(OrderEntity);
		await orderRepo.save(Order.register(INPUT_ORDER, INPUT_USER.id));

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
