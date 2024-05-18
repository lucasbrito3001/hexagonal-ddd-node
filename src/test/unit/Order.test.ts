import { Order } from "@/domain/entities/Order";
import { describe, expect, test } from "vitest";
import { MockInputOrder } from "../constants";
import { OrderStatus } from "@/infra/repository/entity/Order.entity";
import { OrderItem } from "@/domain/entities/OrderItem";

describe("[Domain - Order", () => {
	test("should register a new order, returning id, totalCost, status and createdAt", () => {
		const input = new MockInputOrder();
		input.items[0].unitPrice = 10;
		input.items[0].quantity = 10;

		const order = Order.register(input, "0-0-0-0-0", () => "x-x-x-x-x");

		expect(order.id).toBe("x-x-x-x-x");
		expect(order.totalCost).toBe(100);
		expect(order.status).toBe(OrderStatus.PendingStockValidation);
		expect(order.createdAt).toBeDefined();
	});

	test("should update the order status to ItemsApproved", () => {
		const order = Order.register(new MockInputOrder(), "0-0-0-0-0");
		const orderUpdated = Order.approveOrderItems(order);

		expect(orderUpdated).toBeInstanceOf(Order);
		expect(orderUpdated.status).toBe(OrderStatus.PendingPaymentValidation);
	});

	test("should update the order status to ItemsRejected", () => {
		const order = Order.register(new MockInputOrder(), "0-0-0-0-0");
		const orderUpdated = Order.rejectOrderItems(order);

		expect(orderUpdated).toBeInstanceOf(Order);
		expect(orderUpdated.status).toBe(OrderStatus.RejectedStockValidation);
	});

	test("should update the order status to PaymentApproved", () => {
		const order = Order.register(new MockInputOrder(), "0-0-0-0-0");
		const orderUpdated = Order.approvePayment(order);

		expect(orderUpdated).toBeInstanceOf(Order);
		expect(orderUpdated.status).toBe(OrderStatus.Processing);
	});

	test("should update the order status to PaymentRejected", () => {
		const order = Order.register(new MockInputOrder(), "0-0-0-0-0");
		const orderUpdated = Order.rejectPayment(order);

		expect(orderUpdated).toBeInstanceOf(Order);
		expect(orderUpdated.status).toBe(OrderStatus.RejectedPaymentValidation);
	});

	test("should construct a new Order", () => {
		const { items } = new MockInputOrder();

		const orderItems = OrderItem.register(
			"0-0-0-0-0",
			items[0].itemId,
			items[0].quantity,
			10
		);

		const order = Order.instance(
			"0-0-0-0-0",
			"0-0-0-0-0",
			[orderItems],
			OrderStatus.PendingStockValidation,
			50,
			"2023-01-01T00:00:00.000Z"
		);

		expect(order).toBeInstanceOf(Order);
	});
});
