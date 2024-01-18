import { beforeEach, describe, expect, test } from "vitest";
import { ListOrders } from "@/application/usecase/ListOrders";
import { OrderMemoryRepository } from "../../infra/repository/mock/OrderMemoryRepository";
import { INPUT_ORDER } from "../constants";
import { Order } from "../../domain/entities/Order";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { InvalidDateRangeError, OrderNotFoundError } from "@/error/OrderError";

describe("[Use Case - ListOrders]", () => {
	const registry = new DependencyRegistry();
	let listOrders: ListOrders;
	let orderMemoryRepository: OrderMemoryRepository;

	beforeEach(() => {
		orderMemoryRepository = new OrderMemoryRepository();

		registry.push("orderRepository", orderMemoryRepository);

		listOrders = new ListOrders(registry);
	});

	test("should return InvalidDateRangeError when startDate > endDate", async () => {
		const startDate = new Date("2023-01-02");
		const endDate = new Date("2023-01-01");

		const fn = () => listOrders.execute(startDate, endDate);

		expect(fn).rejects.toBeInstanceOf(InvalidDateRangeError);
	});

	test("should return OrderNotFoundError when don't have orders in the range", async () => {
		const startDate = new Date("2023-01-02");
		const endDate = new Date("2023-01-03");

		const fn = () => listOrders.execute(startDate, endDate);

		expect(fn).rejects.toBeInstanceOf(OrderNotFoundError);
	});

	test("should list orders successfully", async () => {
		const currentDate = new Date();

		const startDate = new Date(currentDate);
		startDate.setDate(startDate.getDate() - 1);

		const endDate = new Date(currentDate);
		endDate.setDate(endDate.getDate() + 1);

		const order = Order.register(INPUT_ORDER, "0", () => "0-0-0-0-0");
		await orderMemoryRepository.save(order);

		const orders = (await listOrders.execute(startDate, endDate)) as Order[];

		expect(orders[0] instanceof Order).toBeTruthy();
	});
});
